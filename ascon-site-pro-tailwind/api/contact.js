export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, company, email, phone, pickup, delivery, notes, ...rest } = req.body || {};
  try {
    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `ASCON Website <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: 'dispatch@shipascon.com',
      subject: `New quote request — ${name ?? ''}`.trim(),
      replyTo: email,
      text: `Company: ${company}\nEmail: ${email}\nPhone: ${phone}\nPickup: ${pickup}\nDelivery: ${delivery}\nNotes: ${notes}\nExtra: ${JSON.stringify(rest)}`,
    });
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ ok: false }); }
}
