import twilio from "twilio";

const getTwilioClient = () => {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
};

export const sendOtpSms = async (phoneNumber, code) => {
  const client = getTwilioClient();

  await client.messages.create({
    body: `Your AlisterBank verification code is: ${code}. This code expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};
