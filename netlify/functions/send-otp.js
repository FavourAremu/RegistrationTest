import twilio from "twilio";

/**
 * TEMP OTP STORE (in-memory)
 * NOTE: This resets if Netlify restarts the function
 * Fine for MVP / testing
 */
const otpStore = new Map();

export async function handler(event) {
  try {
    // ❗ READ BODY ONCE — THIS FIXES YOUR ERROR
    const body = JSON.parse(event.body);

    const { phoneNumber, action, otp } = body;

    if (!phoneNumber || !action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing parameters" }),
      };
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // =========================
    // SEND OTP
    // =========================
    if (action === "send") {
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP with expiry (5 minutes)
      otpStore.set(phoneNumber, {
        otp: generatedOTP,
        expiresAt: Date.now() + 5 * 60 * 1000,
        attempts: 0,
      });

      await client.messages.create({
        body: `Your verification code is ${generatedOTP}. It expires in 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          expiresIn: "5 minutes",
        }),
      };
    }

    // =========================
    // VERIFY OTP
    // =========================
    if (action === "verify") {
      const record = otpStore.get(phoneNumber);

      if (!record) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "No OTP found. Please request a new one.",
          }),
        };
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(phoneNumber);
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "OTP expired. Please request a new one.",
          }),
        };
      }

      record.attempts++;

      if (record.attempts > 5) {
        otpStore.delete(phoneNumber);
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Too many attempts. OTP invalidated.",
          }),
        };
      }

      if (otp !== record.otp) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Invalid OTP",
            attemptsRemaining: 5 - record.attempts,
          }),
        };
      }

      // SUCCESS
      otpStore.delete(phoneNumber);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid action" }),
    };
  } catch (error) {
    console.error("OTP Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Authentication / Server error",
      }),
    };
  }
}
