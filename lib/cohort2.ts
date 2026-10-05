// Single source of truth for Cohort 2 of "Make AI Work".
// Change details here and the banner, home page, checkout, success page and emails follow.

export const FIT_CALL_URL =
  'https://wa.me/97450176561?text=Hi%20Allan%2C%20I%27d%20like%20to%20book%20a%2010-minute%20fit%20call%20for%20Cohort%202%20of%20Make%20AI%20Work%20%2824%20October%29.'

export const COHORT_NAME = 'Make AI Work · Cohort 2'
export const COHORT_DATE_LONG = 'Saturday 24 October 2026'
export const COHORT_TIME_DOHA = '10:00–12:30 Doha (GMT+3)'
export const COHORT_TIME_DUBAI = '11:00–13:30 Dubai (GMT+4)'

export const PRICE_USD = 275
export const PRICE_AED = 1000
export const PRICE_QAR = 990
// PayPal's standard currency list has no AED, so card/PayPal charges in USD.
// Bank transfer and invoices can be settled in AED or QAR.
export const PAYPAL_CURRENCY = 'USD'
export const MAX_SEATS = 10

export const paypalTotal = (seats: number) => (PRICE_USD * seats).toFixed(2)

export const BANK = {
  bank: 'Commercial Bank of Qatar',
  accountName: 'SAFEHAVEN LLC',
  accountNumber: '401031480031001',
  iban: 'QA31CBQA000000401031480031001',
  swift: 'CBQAQAQA',
  currency: 'QAR',
}

export const INVOICE_EMAIL = 'allan@safehavenai.world'

export const COHORT_DESCRIPTION =
  'A 2.5-hour live working session for business owners: map one workflow, find the work AI should do, and leave with one task specified well enough to build. Cohort 2: Saturday 24 October. $275.'
