import nodemailer from "nodemailer";

// const createTransporter = () => {
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_APP_PASSWORD,
//     },
//   });
// };

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (email, code) => {
  const verifyLink = createVerifyLink(email, code);
  const mailOptions = {
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
        <a href="${verifyLink}">Verfiy Email</a>
      </div>
    `,
  };

  await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
};

export const sendEmail = async (toEmail, subject, html) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailOptions);
  const testEmailUrl = nodemailer.getTestMessageUrl(info);
  console.log("verify Email : ", testEmailUrl);
};

const createVerifyLink = (email, code) => {
  const encodedEmail = encodeURIComponent(email);
  return `${process.env.FRONTEND_URL}/verify-email?token=${code}&email=${encodedEmail}`;
};

export const sendResetPasswordEmail = async (email, code) => {
  const resetLink = createResetPasswordLink(email, code);
  const mailOptions = {
    to: email,
    subject: "Reset Your Password - AlisterBank",
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          This link will expire in <strong>10 minutes</strong>.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `,
  };

  await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
};

const createResetPasswordLink = (email, code) => {
  const encodedEmail = encodeURIComponent(email);
  return `${process.env.FRONTEND_URL}/reset-password?token=${code}&email=${encodedEmail}`;
};
