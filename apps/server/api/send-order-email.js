import { Resend } from 'resend';

export default async function handler(request, response) {
  const resend = new Resend(process.env.RESEND_API);

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'flowersgaurnett@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });

    return response.status(200).json({
      message: "email sent",
    });
  } catch (error) {
    return response.status(500).json({ error: 'Error sending email' });
  }
}