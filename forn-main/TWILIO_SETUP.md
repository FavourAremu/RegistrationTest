# Twilio Setup Guide

## Step 1: Create a Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up with your email
3. Verify your email address
4. Complete phone verification (you'll receive an SMS)

## Step 2: Get Your Credentials

1. Log in to [Twilio Console](https://www.twilio.com/console)
2. You'll see your **Account SID** and **Auth Token** on the dashboard
3. Keep these safe - treat them like passwords!

### Finding Your Credentials:
- **Account SID**: Displayed on console homepage (starts with `AC...`)
- **Auth Token**: Click "Show" next to the padlock icon (starts with long alphanumeric string)

## Step 3: Get a Phone Number

1. In Twilio Console, go to **Develop → Phone Numbers → Manage → Active Numbers**
2. If no numbers exist, click **Get your Twilio phone number**
3. Select a country (USA recommended for testing)
4. Choose a number and confirm purchase (free trial includes credits)
5. Copy your phone number in format: `+1XXXXXXXXXX`

### Example:
- US Number: `+12125551234`
- UK Number: `+442071838750`

## Step 4: Set Up Environment Variables

### Local Development (.env.local)

Create a file named `.env.local` in your project root:

```env
NETLIFY_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+12125551234
```

**Important**: Never commit `.env.local` to Git!

### Netlify Dashboard Setup

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site Settings → Build & Deploy → Environment**
4. Click **Add Environment Variable**
5. Add each variable:
   - Key: `TWILIO_ACCOUNT_SID`
   - Value: Your Account SID
6. Repeat for `TWILIO_AUTH_TOKEN` and `TWILIO_PHONE_NUMBER`

## Step 5: Test Your Configuration

### Test with cURL (from terminal):

```bash
curl -X POST http://localhost:8888/.netlify/functions/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+12125551234",
    "action": "send"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": "10 minutes"
}
```

### Test via Form UI:

1. Run `npm run dev`
2. Open http://localhost:8888
3. Enter phone number and click "Verify"
4. Check console for errors if SMS doesn't arrive
5. You should receive an SMS with the code

## Troubleshooting

### "Invalid phone number" Error
- **Problem**: Phone number format incorrect
- **Solution**: Use format `+1XXXXXXXXXX` for US numbers
- Check Twilio console for your exact number format

### "Authentication failed" Error
- **Problem**: Wrong Account SID or Auth Token
- **Solution**: Copy directly from Twilio Console (don't include spaces)
- Double-check credentials in .env files

### SMS Not Arriving
- **Problem**: Number format, carrier issues, or account restrictions
- **Solution**:
  1. Check Twilio Message Logs in console
  2. Verify number is on approved list (free accounts have restrictions)
  3. Test with Twilio's messaging API directly
  4. Try upgrading free account to paid

### Rate Limiting
- **Problem**: Too many SMS requests too quickly
- **Solution**: Twilio free accounts have reasonable limits
  - Add delays between requests
  - Implement cooldown periods
  - Check `attemptsRemaining` in responses

## Cost Considerations

### Free Trial
- $15 starting credit
- Limited to verified numbers (you add manually)
- Good for testing with up to 20 phone numbers

### Paid Account
- Outbound SMS: ~$0.0075 per message (USA)
- Inbound SMS: Included in most plans
- Upgrade at any time

### Optimize Costs
- Set OTP expiry to prevent retries (currently 10 minutes)
- Limit attempts (currently 3 attempts)
- Rate limit OTP requests

## API Reference

### Send OTP
```
POST /.netlify/functions/send-otp
Content-Type: application/json

{
  "phoneNumber": "+12125551234",
  "action": "send"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": "10 minutes"
}
```

### Verify OTP
```
POST /.netlify/functions/send-otp
Content-Type: application/json

{
  "phoneNumber": "+12125551234",
  "action": "verify",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Phone number verified",
  "verified": true
}
```

## Security Best Practices

1. **Never expose credentials**
   - Use environment variables only
   - Don't log credentials
   - Don't commit .env files

2. **Phone number validation**
   - Validate format before sending
   - Check for international format

3. **OTP security**
   - 10-minute expiry (not configurable per request)
   - 3 attempt limit
   - Delete after verification

4. **Rate limiting**
   - Implement backend rate limiting
   - Prevent brute force attacks
   - Log suspicious activity

## Support & Resources

- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio Console](https://www.twilio.com/console)
- [SMS API Guide](https://www.twilio.com/docs/sms/quickstart)
- [Troubleshooting](https://www.twilio.com/docs/sms/faq)

## Next Steps

1. Create Twilio account
2. Get phone number
3. Copy credentials to .env.local
4. Deploy credentials to Netlify
5. Test with form or cURL
6. Deploy to production!
