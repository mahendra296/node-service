import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (email, code) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Email Verification Code - AlisterBank",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Your verification code is:
        </p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          This code will expire in <strong>10 minutes</strong>.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
