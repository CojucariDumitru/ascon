// ascon-site-pro-tailwind/api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, company, email, phone, pickup, delivery, notes, ...rest } = req.body || {};

  try {
    const nodemailer = (await import('nodemailer')).default;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465, // SSL on 465; STARTTLS on 587
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // Build unified data object from whichever fields were sent
    const data = {
      Source: rest?.source, // "Driver Recruiting" or "Shipper Quote"
      Name: name,
      Company: company,
      Email: email,
      Phone: phone,
      Commodity: rest?.commodity,
      Weight: rest?.weight,
      Dimensions: rest?.dims,
      Pickup: pickup,
      Delivery: delivery,
      'Pickup Date': rest?.date,
      'CDL Class': rest?.cdl,
      'Flatbed Experience (yrs)': rest?.flatbed_exp,
      Position: rest?.position,
      TWIC: rest?.twic,
      'Home State': rest?.home_state,
      Notes: notes,
    };

    // Keep only filled fields
    const entries = Object.entries(data).filter(
      ([, v]) => v != null && String(v).trim() !== ''
    );

    // Plain-text body
    const text = entries.map(([k, v]) => `${k}: ${v}`).join('\n');

    // HTML body
    const htmlRow = (k, v) => `
      <tr>
        <td style="padding:8px 10px;color:#555;border-bottom:1px solid #eee">${k}</td>
        <td style="padding:8px 10px;color:#000;font-weight:600;border-bottom:1px solid #eee">${String(v).replace(/\n/g,'<br>')}</td>
      </tr>`;

    const html = `
      <div style="font:14px/1.5 ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial">
        <h2 style="margin:0 0 10px 0">ASCON Website — ${rest?.source || 'Submission'}</h2>
        <table style="border-collapse:collapse;width:100%;background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden">
          ${entries.map(([k, v]) => htmlRow(k, v)).join('')}
        </table>
        <p style="color:#777;margin-top:12px">MC# 1077266 · ASCON GROUP INC</p>
      </div>
    `;

    // Subject: choose by source, then append helpful details
    const src = (rest?.source || '').toLowerCase();
    let subjectBase = 'New Website Submission';
    if (src === 'driver recruiting') subjectBase = 'New Driver Application';
    if (src === 'shipper quote')     subjectBase = 'New Shipper Quote';

    const details = [];
    if (company) details.push(company);
    if (pickup || delivery) details.push(`${pickup || ''}${pickup && delivery ? ' → ' : ''}${delivery || ''}`);
    if (name) details.push(`· ${name}`);
    const subject = [subjectBase, details.join(' ')].filter(Boolean).join(' — ').trim();

    // Recipient(s)
    const to = process.env.TO_EMAIL || 'dima@shipascon.com';
    // If you later want split recipients, swap the line above with:
    // const to = src === 'shipper quote'
    //   ? (process.env.SHIPPER_TO || 'dispatch@shipascon.com')
    //   : (process.env.DRIVER_TO  || 'dima@shipascon.com');

    await transporter.sendMail({
      from: `ASCON Website <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      replyTo: email || undefined,
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Email error:', e && (e.response || e.message || e.toString()));
    return res.status(500).json({ ok: false, error: 'Email failed' });
  }
}
