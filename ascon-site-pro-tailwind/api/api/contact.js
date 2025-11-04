// ascon-site-pro-tailwind/api/contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const {
    name, company, email, phone, pickup, delivery, notes, ...rest
  } = req.body || {};

  try {
    const nodemailer = (await import('nodemailer')).default;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465, // SSL on 465
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    // ---- pretty formatting ----
    const labels = {
      name: 'Name',
      company: 'Company',
      email: 'Email',
      phone: 'Phone',
      commodity: 'Commodity',
      weight: 'Weight',
      dims: 'Dimensions',
      pickup: 'Pickup',
      delivery: 'Delivery',
      date: 'Pickup Date',
      cdl: 'CDL Class',
      flatbed_exp: 'Flatbed Experience (yrs)',
      position: 'Position',
      twic: 'TWIC',
      home_state: 'Home State',
      notes: 'Notes',
      source: 'Source'
    };

    // Collect values (include both shipper + driver fields if present)
    const data = {
      name, company, email, phone,
      commodity: rest?.commodity, weight: rest?.weight, dims: rest?.dims,
      pickup, delivery, date: rest?.date,
      cdl: rest?.cdl, flatbed_exp: rest?.flatbed_exp, position: rest?.position, twic: rest?.twic,
      home_state: rest?.home_state,
      notes, source: rest?.source
    };

    const lines = [];
    for (const [k, v] of Object.entries(data)) {
      if (v != null && String(v).trim() !== '') {
        lines.push(`${labels[k] || k}: ${v}`);
      }
    }

    // Optional: split recipients by form type
    // const to = rest?.source === 'Shipper Quote'
    //   ? (process.env.SHIPPER_TO || 'dispatch@shipascon.com')
    //   : (process.env.DRIVER_TO  || 'dima@shipascon.com');

    const to = process.env.TO_EMAIL || 'dima@shipascon.com';

    const subject = `[${rest?.source || 'Website'}] ${
      (company ? company + ' — ' : '') +
      (pickup ? pickup + ' → ' : '') +
      (delivery || '')
    }${name ? ' · ' + name : ''}`.trim() || 'New submission';

    // Simple HTML table
    const row = (label, value) =>
      (value == null || String(value).trim() === '')
        ? ''
        : `<tr><td style="padding:6px 10px;color:#555">${label}</td><td style="padding:6px 10px;color:#000;font-weight:600">${String(value).replace(/\n/g,'<br>')}</td></tr>`;

    const html = `
      <div style="font:14px/1.45 ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial">
        <h2 style="margin:0 0 10px 0">ASCON Website — ${rest?.source || 'Submission'}</h2>
        <table style="border-collapse:collapse;width:100%;background:#fff;border:1px solid #eee;border-radius:10px;overflow:hidden">
          ${row(labels.name, name)}
          ${row(labels.company, company)}
          ${row(labels.email, email)}
          ${row(labels.phone, phone)}
          ${row(labels.commodity, rest?.commodity)}
          ${row(labels.weight, rest?.weight)}
          ${row(labels.dims, rest?.dims)}
          ${row(labels.pickup, pickup)}
          ${row(labels.delivery, delivery)}
          ${row(labels.date, rest?.date)}
          ${row(labels.cdl, rest?.cdl)}
          ${row(labels.flatbed_exp, rest?.flatbed_exp)}
          ${row(labels.position, rest?.position)}
          ${row(labels.twic, rest?.twic)}
          ${row(labels.home_state, rest?.home_state)}
          ${row(labels.notes, notes)}
        </table>
        <p style="color:#777;margin-top:12px">MC# 1077266 · ASCON GROUP INC</p>
      </div>
    `;

    await transporter.sendMail({
      from: `ASCON Website <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      replyTo: email || undefined,
      subject,
      text: lines.join('\n'), // plaintext fallback
      html
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Email error:', e && (e.response || e.message || e.toString()));
    return res.status(500).json({ ok: false, error: 'Email failed' });
  }
}
