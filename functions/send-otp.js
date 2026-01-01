import Twilio from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function handler(event) {
  // 🚫 NEVER read body more than once
  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid JSON" })
    };
  }

  const { phoneNumber, action, otp } = data;

  if (!phoneNumber || !action) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Missing fields" })
    };
  }

  if (action === "send") {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await client.messages.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Your verification code is ${code}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        expiresIn: "5 minutes"
      })
    };
  }

  if (action === "verify") {
    // demo-only validation
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ success: false, error: "Invalid action" })
  };
}
