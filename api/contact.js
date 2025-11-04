import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  try {
    const body = req.body || {}
    if (body.company_website) return res.status(200).json({ ok: true, skipped: true })

    const { source='Website', name, email, phone, notes, commodity, weight, dims, pickup, delivery, date, cdl, flatbed_exp, position, twic, home_state } = body
    const subject = source === 'Shipper Quote' ? `Quote Request — ${pickup || '??'} → ${delivery || '??'} (${commodity || 'Freight'})` : `Driver Contact — ${name || 'Unknown'} (${position || 'Applicant'})`

    const rows = Object.entries({ Source: source, Name: name, Email: email, Phone: phone, 'Commodity (Quote)': commodity, 'Weight (lbs) (Quote)': weight, 'Dimensions (Quote)': dims, 'Pickup (Quote)': pickup, 'Delivery (Quote)': delivery, 'Pickup Date (Quote)': date, 'CDL (Driver)': cdl, 'Flatbed Exp (yrs) (Driver)': flatbed_exp, 'Position (Driver)': position, 'TWIC (Driver)': twic, 'Home State (Driver)': home_state, Notes: notes }).filter(([,v]) => v !== undefined && v !== '')

    const html = `<div style=\"font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial\"><h2 style=\"margin:0 0 8px 0\">ASCON Website Form</h2><p style=\"margin:0 0 12px 0;color:#555\">MC# 1077266 — shipascon.com</p><table cellpadding=\"6\" cellspacing=\"0\" style=\"border-collapse:collapse;border:1px solid #eee\">${rows.map(([k,v]) => `<tr><td style=\"border:1px solid #eee;background:#fafafa;font-weight:600\">${k}</td><td style=\"border:1px solid #eee\">${String(v).replace(/\n/g,'<br/>')}</td></tr>`).join('')}</table></div>`
    const text = rows.map(([k,v]) => `${k}: ${v}`).join('\n')

    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465), secure: Number(process.env.SMTP_PORT || 465) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
    const from = process.env.SMTP_FROM || process.env.SMTP_USER
    const to = process.env.TO_EMAIL || 'dispatch@shipascon.com'

    await transporter.sendMail({ from: `ASCON Website <${from}>`, to, replyTo: email || undefined, subject, text, html })
    return res.status(200).json({ ok: true })
  } catch(err) {
    console.error('Email error:', err)
    return res.status(500).json({ ok: false, error: 'Email failed' })
  }
}
