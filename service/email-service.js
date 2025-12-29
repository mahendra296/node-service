import nodemailer from "nodemailer";
import mjml2html from "mjml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const resend = new Resend(process.env.GMAIL_RESEND_API_KEY);

// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_APP_PASSWORD,
//     },
//   });
// };

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

  // send email using nodemailer https://ethereal.email/ testing
  // const info = await transporter.sendMail(mailOptions);
  // const testEmailUrl = nodemailer.getTestMessageUrl(info);
  // console.log("verify Email : ", testEmailUrl);

  // send email using nodemailer google email configuration
  const info = await transporter.sendMail(mailOptions);
  const testEmailUrl = nodemailer.getTestMessageUrl(info);
  console.log("verify Email : ", testEmailUrl);
};

export const sendEmailUsingResendAPI = async (toEmail, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_RESEND_USER,
      to: [toEmail],
      subject: subject,
      html: html,
    };
    const { data, error } = await resend.emails.send(mailOptions);
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error("Email send error", error);
  }
};

const createVerifyLink = (email, code) => {
  const encodedEmail = encodeURIComponent(email);
  return `${process.env.FRONTEND_URL}/verify-email?token=${code}&email=${encodedEmail}`;
};

export const sendResetPasswordEmail = async (email, code) => {
  const resetLink = createResetPasswordLink(email, code);

  // Read and compile MJML template
  const templatePath = path.join(
    __dirname,
    "../templates/email/reset-password.mjml"
  );
  const mjmlTemplate = fs.readFileSync(templatePath, "utf8");

  // Replace placeholder with actual reset link
  const mjmlWithData = mjmlTemplate.replace("{{resetLink}}", resetLink);

  // Convert MJML to HTML
  const { html } = mjml2html(mjmlWithData);

  const mailOptions = {
    to: email,
    subject: "Reset Your Password - AlisterBank",
    html: html,
  };

  // await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
  await sendEmail(
    mailOptions.to,
    mailOptions.subject,
    mailOptions.html
  );
};

const createResetPasswordLink = (email, code) => {
  const encodedEmail = encodeURIComponent(email);
  return `${process.env.FRONTEND_URL}/reset-password?token=${code}&email=${encodedEmail}`;
};
