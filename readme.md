# Student Registration Form

A modern, responsive student registration form with OTP phone verification and Netlify Neon PostgreSQL database integration.

## Features

- ✅ **Responsive Design** - Mobile-optimized with touch-friendly inputs
- ✅ **Phone Number Verification** - OTP via Twilio SMS
- ✅ **Age Validation** - Minimum 14 years old requirement
- ✅ **Form Validation** - Real-time validation with error messages
- ✅ **Database Integration** - Netlify Neon PostgreSQL
- ✅ **Secure Submission** - API-based form submission
- ✅ **Modern UI** - Gradient background, smooth animations, ripple effects

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Netlify Functions (Node.js)
- **Database**: PostgreSQL (via Netlify Neon)
- **SMS Service**: Twilio
- **Hosting**: Netlify

## Prerequisites

- Node.js (v18+)
- Netlify CLI (`npm install -g netlify-cli`)
- Twilio Account (free tier available)
- Netlify Account with Neon Database enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@netlify/neon` - PostgreSQL client
- `twilio` - SMS service
- `netlify-cli` - Development and deployment tools

### 2. Set Up Twilio SMS Service

1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Get your credentials:
   - Account SID
   - Auth Token
   - Phone Number (assigned to your account)
3. These will be used in environment variables

### 3. Set Up Neon PostgreSQL Database

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Create a new Neon Database connection
3. Copy the `NETLIFY_DATABASE_URL`

### 4. Create Database Table

Run this SQL in your Neon console:

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(50),
  address TEXT,
  telephone VARCHAR(20),
  email VARCHAR(255),
  courses TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON students(email);
CREATE INDEX idx_phone ON students(telephone);
```

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NETLIFY_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

Also add these to Netlify Dashboard:
- Site Settings → Build & Deploy → Environment
- Add the same environment variables

### 6. Development

Run the local development server:

```bash
npm run dev
```

This starts:
- Local server on http://localhost:8888
- Serverless functions on http://localhost:8888/.netlify/functions/

### 7. Test the Form

1. Enter student details
2. Click "Verify" button for phone number
3. Check Twilio console for SMS (or check actual phone if real number)
4. Enter the 6-digit code
5. Submit the form

### 8. Deploy to Netlify

```bash
# Build and deploy
netlify deploy --prod
```

Or connect your Git repository to Netlify for automatic deployments.

## Project Structure

```
.
├── index.html                              # Main form page
├── package.json                            # Dependencies
├── netlify.toml                            # Netlify config
├── README.md                               # This file
└── netlify/functions/
    ├── register-student.js                 # Register form data
    └── send-otp.js                         # Send/verify OTP codes
```

## API Endpoints

### Register Student
**POST** `/.netlify/functions/register-student`

Request:
```json
{
  "name": "John Doe",
  "dob": "2010-05-15",
  "gender": "male",
  "address": "123 Main St",
  "telephone": "1234567890",
  "email": "john@example.com",
  "courses": ["mathematics", "physics"],
  "submittedAt": "2025-12-08T10:30:00Z"
}
```

Response:
```json
{
  "success": true,
  "studentId": 42
}
```

### Send/Verify OTP
**POST** `/.netlify/functions/send-otp`

**Send OTP:**
```json
{
  "phoneNumber": "+11234567890",
  "action": "send"
}
```

**Verify OTP:**
```json
{
  "phoneNumber": "+11234567890",
  "action": "verify",
  "otp": "123456"
}
```

## Validation Rules

- **Name**: Required, text only
- **Date of Birth**: Required, minimum 14 years old
- **Gender**: Required (Male, Female, Other)
- **Address**: Required, text
- **Telephone**: Required, 10-15 digits, must verify via OTP
- **Email**: Required, valid email format
- **Courses**: Required, at least one course must be selected (Mathematics, Physics, Biology, Chemistry)

## Security Features

- ✅ Server-side validation
- ✅ OTP expiry (10 minutes)
- ✅ Attempt limiting (3 attempts per OTP)
- ✅ HTTPS on Netlify
- ✅ No sensitive data in frontend
- ✅ Environment variables for credentials

## Troubleshooting

### OTP not sending
- Check Twilio credentials in environment variables
- Verify phone number format: `+1XXXXXXXXXX` (US example)
- Check Twilio console for error logs

### Database connection error
- Verify `NETLIFY_DATABASE_URL` is correct
- Check SSL mode in connection string
- Ensure table exists with correct schema

### Form not submitting
- Check browser console for errors
- Verify phone number is verified (shows ✓)
- Ensure all required fields are filled
- Check Network tab for API response errors

### Local development issues
- Run `netlify dev` not `npm run dev`
- Make sure port 8888 is available
- Clear `.netlify` folder and restart

## Performance Optimization

- Minified CSS and JavaScript
- Optimized form layout for mobile
- Efficient database queries
- Proper indexing on frequently searched columns

## Future Enhancements

- [ ] Email verification option
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Bulk upload CSV
- [ ] Export registration reports
- [ ] Email confirmation
- [ ] SMS confirmation

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Netlify and Twilio documentation
3. Check browser console for errors
4. Review function logs in Netlify Dashboard

## License

MIT - Feel free to use for educational and commercial projects

## Credits

Built with Netlify Functions, Neon PostgreSQL, and Twilio SMS
