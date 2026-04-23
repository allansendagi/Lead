// api/submit.js — Lead capture endpoint
// Uses native fetch (Node 24+) — no npm dependencies

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// ── Scoring (mirrors Chapter 2 of The AI Roadmap) ──────────────────────────
const BAND_RANGES = [
  { band: 'foundation', min: 5,  max: 8  },
  { band: 'getting',    min: 9,  max: 11 },
  { band: 'good',       min: 12, max: 13 },
  { band: 'ready',      min: 14, max: 15 }
];

// Exact option titles from the frontend — stored verbatim in the DB
const DIM_LABELS = [
  ['Manual process',         'Existing software',     'No system yet'              ],
  ['High complexity',        'Medium complexity',      'Low complexity — rule-based'],
  ['Poor or no data',        'Some data — needs work', 'Good structured data'       ],
  ['Low volume',             'Medium volume',          'High volume — daily'        ],
  ['1–5 people',             '6–20 people',            '20+ people'                 ]
];

const DIM_KEYS = [
  'Starting point',
  'Decision complexity',
  'Data readiness',
  'Workflow volume',
  'Team scale'
];

function computeScore(answers) {
  return answers.reduce((a, b) => a + b, 0);
}
function computeBand(score) {
  return BAND_RANGES.find(r => score >= r.min && score <= r.max)?.band || 'foundation';
}

// ── Validation ─────────────────────────────────────────────────────────────
function isValidName(v) {
  return typeof v === 'string'
    && v.trim().length >= 2
    && v.trim().length <= 60
    && /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-\.]+$/.test(v.trim());
}
function isValidCompany(v) {
  if (!v) return true; // optional
  return typeof v === 'string' && v.trim().length <= 80;
}
function isValidPhone(v) {
  if (!v || typeof v !== 'string') return false;
  const d = v.replace(/\D/g, '');
  if (d.length < 6 || d.length > 15) return false;
  if (/^(.)\1+$/.test(d)) return false; // all same digit
  return true;
}
function isValidEmail(v) {
  return typeof v === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
    && v.length <= 100;
}
function isValidAnswers(v) {
  return Array.isArray(v)
    && v.length === 5
    && v.every(a => [1, 2, 3].includes(Number(a)));
}
function isValidContactMode(v) {
  return ['wa', 'email', 'both'].includes(v);
}
function isValidTiming(submittedAt) {
  if (!submittedAt || typeof submittedAt !== 'number') return true;
  return (Date.now() - submittedAt) >= 8000;
}

// ── Supabase helpers (native fetch) ────────────────────────────────────────
async function dbInsert(table, row) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey':        SUPA_KEY,
      'Authorization': `Bearer ${SUPA_KEY}`,
      'Prefer':        'return=representation'
    },
    body: JSON.stringify(row)
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  return Array.isArray(body) ? body[0] : body;
}

async function dbCountRecentByIP(ip) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const res = await fetch(
    `${SUPA_URL}/rest/v1/leads?ip_address=eq.${encodeURIComponent(ip)}&is_honeypot=eq.false&created_at=gte.${since}&select=id`,
    {
      headers: {
        'apikey':        SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Prefer':        'count=exact',
        'Range':         '0-0'
      }
    }
  );
  const header = res.headers.get('content-range');
  return header ? parseInt(header.split('/')[1], 10) || 0 : 0;
}

// ── Main handler ───────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin',   origin);
  res.setHeader('Access-Control-Allow-Methods',  'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',  'Content-Type');
  res.setHeader('X-Content-Type-Options',        'nosniff');
  res.setHeader('X-Frame-Options',               'DENY');
  res.setHeader('X-XSS-Protection',              '1; mode=block');
  res.setHeader('Referrer-Policy',               'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy',       "default-src 'none'");

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  if (!SUPA_URL || !SUPA_KEY) {
    console.error('[config] Missing SUPABASE_URL or key. URL:', SUPA_URL ? 'set' : 'MISSING', 'KEY:', SUPA_KEY ? 'set' : 'MISSING');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const body = req.body || {};

  // ── Honeypot ──
  if (body.hp) {
    console.warn('[honeypot] caught ip:', (req.headers['x-forwarded-for'] || '').split(',')[0].trim());
    return res.status(200).json({ success: true });
  }

  // ── Timing check ──
  if (!isValidTiming(body.pageLoadedAt)) {
    console.warn('[timing] too fast — likely bot');
    return res.status(200).json({ success: true });
  }

  // ── IP ──
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  // ── Rate limit ──
  if (ip !== 'unknown') {
    try {
      const recent = await dbCountRecentByIP(ip);
      if (recent >= 5) {
        return res.status(429).json({ error: 'Too many submissions. Please wait a minute and try again.' });
      }
    } catch (e) {
      console.warn('[rate-limit] check failed (non-blocking):', e.message);
    }
  }

  // ── Validate ──
  const errors = {};
  if (!isValidName(body.name))               errors.name        = 'Invalid name';
  if (!isValidCompany(body.company))         errors.company     = 'Invalid company name';
  if (!isValidContactMode(body.contactMode)) errors.contactMode = 'Invalid contact mode';

  if (!isValidAnswers(body.answers)) {
    errors.answers = 'Invalid answers';
  } else {
    const answers       = body.answers.map(Number);
    const expectedScore = computeScore(answers);
    const expectedBand  = computeBand(expectedScore);
    if (body.score !== expectedScore) errors.score = 'Score mismatch';
    if (body.band  !== expectedBand)  errors.band  = 'Band mismatch';
  }

  const mode = body.contactMode;
  if (mode === 'wa'    || mode === 'both') { if (!isValidPhone(body.phone))  errors.phone = 'Invalid phone'; }
  if (mode === 'email' || mode === 'both') { if (!isValidEmail(body.email))  errors.email = 'Invalid email'; }

  if (Object.keys(errors).length > 0) {
    console.warn('[validation] failed:', JSON.stringify(errors), 'ip:', ip);
    return res.status(400).json({ error: 'Validation failed', fields: errors });
  }

  // ── Build waUrl FIRST — never blocked by DB outcome ──────────────────────
  const waNum = (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  let waUrl   = null;

  if (!waNum || waNum.length < 7) {
    console.warn('[config] WHATSAPP_NUMBER not set or too short — waUrl will be null');
  } else {
    const bandLabels = { foundation:'Foundation First', getting:'Getting Ready', good:'Good Candidate', ready:'Ready to Navigate' };
    const msgLines   = [
      `Hi Allan, I just completed the AI Navigator Readiness Assessment.`,
      ``,
      `Name: ${body.name.trim()}`,
      body.company?.trim() ? `Company: ${body.company.trim()}` : null,
      `Score: ${body.score}/15 — ${bandLabels[body.band] || body.band}`,
      ``,
      `I'd love to discuss next steps. When are you available?`
    ].filter(l => l !== null).join('\n');
    waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msgLines)}`;
  }

  // ── Build rich answer data (scores + exact labels) ────────────────────────
  const answers      = body.answers.map(Number);
  const answersRich  = answers.map((score, i) => ({
    question: DIM_KEYS[i],
    score,
    choice: DIM_LABELS[i][score - 1]
  }));
  const dims = {
    dim_starting:   DIM_LABELS[0][answers[0] - 1],
    dim_complexity: DIM_LABELS[1][answers[1] - 1],
    dim_data:       DIM_LABELS[2][answers[2] - 1],
    dim_volume:     DIM_LABELS[3][answers[3] - 1],
    dim_team:       DIM_LABELS[4][answers[4] - 1]
  };

  // ── Insert lead — failure does NOT block waUrl return ─────────────────────
  let leadId    = null;
  let leadSaved = false;
  try {
    const row = await dbInsert('leads', {
      name:         body.name.trim(),
      company:      body.company?.trim()             || null,
      phone:        body.phone                       || null,
      email:        body.email?.toLowerCase().trim() || null,
      contact_mode: body.contactMode,
      score:        Number(body.score),
      band:         body.band,
      answers:      answersRich,   // rich: [{question, score, choice}, ...]
      ...dims,
      user_agent:   req.headers['user-agent']                          || null,
      referrer:     req.headers['referer'] || req.headers['referrer']  || null,
      ip_address:   ip,
      is_honeypot:  false
    });
    leadId    = row?.id;
    leadSaved = true;
    console.log('[lead] saved id:', leadId, 'band:', body.band, 'score:', body.score);
  } catch (err) {
    // Log the FULL error so Vercel logs reveal the real cause
    console.error('[db] insert failed:', err.message, '| url:', SUPA_URL, '| key prefix:', (SUPA_KEY || '').slice(0, 12));
    // Do NOT return 500 — still return waUrl so the user experience is unaffected
  }

  return res.status(200).json({ success: true, id: leadId, waUrl, leadSaved });
};
