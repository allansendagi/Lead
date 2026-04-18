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

const DIM_LABELS = [
  ['Manual', 'Existing software', 'No system yet'],
  ['High complexity', 'Medium complexity', 'Low / rule-based'],
  ['Poor or none', 'Some data', 'Good, structured'],
  ['Low volume', 'Medium volume', 'High / daily'],
  ['1–5 people', '6–20 people', '20+ people']
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
  // Reject submissions that arrive less than 8 seconds after page load
  // (bots typically submit instantly; real humans take ≥15s to read + answer 5 Qs)
  if (!submittedAt || typeof submittedAt !== 'number') return true; // don't block if missing
  const elapsed = Date.now() - submittedAt;
  return elapsed >= 8000;
}

// ── Supabase helpers (native fetch) ────────────────────────────────────────
async function dbInsert(table, row) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPA_KEY,
      'Authorization': `Bearer ${SUPA_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(row)
  });
  const body = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(body));
  return Array.isArray(body) ? body[0] : body;
}

async function dbCountRecentByIP(ip) {
  const since = new Date(Date.now() - 60_000).toISOString();
  const res = await fetch(
    `${SUPA_URL}/rest/v1/leads?ip_address=eq.${encodeURIComponent(ip)}&is_honeypot=eq.false&created_at=gte.${since}&select=id`,
    {
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Prefer': 'count=exact',
        'Range': '0-0'
      }
    }
  );
  const header = res.headers.get('content-range');
  return header ? parseInt(header.split('/')[1], 10) || 0 : 0;
}

// ── Main handler ───────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'");

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  if (!SUPA_URL || !SUPA_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const body = req.body || {};

  // ── Honeypot: silent success for bots ──
  if (body.hp) {
    console.warn('[honeypot] bot caught, ip:', (req.headers['x-forwarded-for'] || '').split(',')[0].trim());
    return res.status(200).json({ success: true });
  }

  // ── Timing check: reject suspiciously fast submissions ──
  if (!isValidTiming(body.pageLoadedAt)) {
    console.warn('[timing] submission too fast, likely bot');
    return res.status(200).json({ success: true }); // silent — don't reveal the check
  }

  // ── Rate limiting: max 5 submissions per IP per minute ──
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  if (ip !== 'unknown') {
    try {
      const recent = await dbCountRecentByIP(ip);
      if (recent >= 5) {
        return res.status(429).json({ error: 'Too many submissions. Please wait a minute and try again.' });
      }
    } catch (e) {
      // Rate limit check failed — don't block the user, just log
      console.warn('Rate limit check failed:', e.message);
    }
  }

  // ── Validate all fields ──
  const errors = {};

  if (!isValidName(body.name))           errors.name    = 'Invalid name';
  if (!isValidCompany(body.company))     errors.company = 'Invalid company name';
  if (!isValidContactMode(body.contactMode)) errors.contactMode = 'Invalid contact mode';
  if (!isValidAnswers(body.answers)) {
    errors.answers = 'Invalid answers';
  } else {
    // Server-side scoring: verify client didn't tamper with score/band
    const answers = body.answers.map(Number);
    const expectedScore = computeScore(answers);
    const expectedBand  = computeBand(expectedScore);

    if (body.score !== expectedScore) errors.score = 'Score mismatch';
    if (body.band  !== expectedBand)  errors.band  = 'Band mismatch';
  }

  const mode = body.contactMode;
  if (mode === 'wa'   || mode === 'both') {
    if (!isValidPhone(body.phone))  errors.phone = 'Invalid phone number';
  }
  if (mode === 'email' || mode === 'both') {
    if (!isValidEmail(body.email))  errors.email = 'Invalid email address';
  }

  if (Object.keys(errors).length > 0) {
    console.warn('[validation] failed:', JSON.stringify(errors), 'ip:', ip);
    return res.status(400).json({ error: 'Validation failed', fields: errors });
  }

  // ── Build dimension labels for readable reporting ──
  const answers = body.answers.map(Number);
  const dims = {
    dim_starting:   DIM_LABELS[0][answers[0] - 1],
    dim_complexity: DIM_LABELS[1][answers[1] - 1],
    dim_data:       DIM_LABELS[2][answers[2] - 1],
    dim_volume:     DIM_LABELS[3][answers[3] - 1],
    dim_team:       DIM_LABELS[4][answers[4] - 1]
  };

  // ── Insert lead ──
  let leadId;
  try {
    const row = await dbInsert('leads', {
      name:         body.name.trim(),
      company:      body.company?.trim()        || null,
      phone:        body.phone                  || null,
      email:        body.email?.toLowerCase().trim() || null,
      contact_mode: body.contactMode,
      score:        Number(body.score),
      band:         body.band,
      answers:      answers,
      ...dims,
      user_agent:   req.headers['user-agent']   || null,
      referrer:     req.headers['referer'] || req.headers['referrer'] || null,
      ip_address:   ip,
      is_honeypot:  false
    });
    leadId = row?.id;
  } catch (err) {
    console.error('DB insert error:', err.message);
    return res.status(500).json({ error: 'Failed to save your submission. Please try again.' });
  }

  // ── Build WhatsApp URL server-side (number never exposed to client) ──
  const waNum = (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  let waUrl = null;

  if (!waNum || waNum.length < 7) {
    console.warn('[config] WHATSAPP_NUMBER not set or invalid — waUrl will be null for this submission');
  }

  if (waNum.length >= 7) {
    const bandLabels = {
      foundation: 'Foundation First',
      getting:    'Getting Ready',
      good:       'Good Candidate',
      ready:      'Ready to Navigate'
    };
    const msg = [
      `Hi Allan, I just completed the AI Navigator Readiness Assessment.`,
      ``,
      `Name: ${body.name.trim()}`,
      body.company?.trim() ? `Company: ${body.company.trim()}` : null,
      `Score: ${body.score}/15 — ${bandLabels[body.band]}`,
      ``,
      `I'd love to discuss next steps. When are you available?`
    ].filter(l => l !== null).join('\n');

    waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
  }

  return res.status(200).json({ success: true, id: leadId, waUrl });
};
