import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken?.token || '',
    },
  } as any);
}

export async function sendOrderConfirmation(orderData: any) {
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: orderData.email,
    subject: `Order Confirmation #${orderData.id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${orderData.id}</p>
      <p>Total: $${orderData.total.toFixed(2)}</p>
      <h2>Items:</h2>
      <ul>
        ${orderData.items
          .map(
            (item: any) =>
              `<li>${item.name} x ${item.quantity} - $${(
                item.price * item.quantity
              ).toFixed(2)}</li>`
          )
          .join('')}
      </ul>
      <p>We'll keep you updated on your order status.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}