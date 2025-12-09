#!/usr/bin/env node

/**
 * Twilio Configuration Helper
 * 
 * This script helps you configure Twilio credentials for the Student Registration Form
 * 
 * Usage:
 *   node setup-twilio.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const envPath = path.join(__dirname, '.env.local');
const examplePath = path.join(__dirname, '.env.example');

async function main() {
    console.log('\n🔧 Twilio Configuration Setup\n');
    console.log('This script will help you configure Twilio credentials.\n');
    
    // Check if .env.local already exists
    if (fs.existsSync(envPath)) {
        const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/n): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('❌ Setup cancelled');
            rl.close();
            return;
        }
    }

    console.log('\n📝 Enter your Twilio credentials from https://www.twilio.com/console\n');

    const accountSid = await question('Account SID (AC...): ');
    const authToken = await question('Auth Token: ');
    const phoneNumber = await question('Twilio Phone Number (+1XXXXXXXXXX): ');
    
    // Validate inputs
    if (!accountSid || !authToken || !phoneNumber) {
        console.log('\n❌ All fields are required');
        rl.close();
        return;
    }

    if (!accountSid.startsWith('AC')) {
        console.log('\n⚠️  Account SID should start with "AC"');
    }

    if (!phoneNumber.startsWith('+')) {
        console.log('\n⚠️  Phone number should start with "+"');
    }

    // Get database URL
    const dbUrl = await question('\nNETLIFY_DATABASE_URL (from Neon): ');

    // Create env content
    const envContent = `# Student Registration Form Environment Variables
# Generated: ${new Date().toISOString()}

# Neon PostgreSQL Database
NETLIFY_DATABASE_URL=${dbUrl || 'postgresql://user:password@host/database?sslmode=require'}

# Twilio SMS Service
TWILIO_ACCOUNT_SID=${accountSid}
TWILIO_AUTH_TOKEN=${authToken}
TWILIO_PHONE_NUMBER=${phoneNumber}

# Optional
SITE_URL=https://your-site.netlify.app
`;

    // Write to file
    try {
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('\n✅ Configuration saved to .env.local\n');
        console.log('📋 Next steps:');
        console.log('   1. Run: npm install');
        console.log('   2. Run: npm run dev');
        console.log('   3. Visit: http://localhost:8888');
        console.log('   4. Test the form\n');
        console.log('🚀 To deploy to Netlify:');
        console.log('   1. Go to Netlify Dashboard');
        console.log('   2. Settings → Build & Deploy → Environment');
        console.log('   3. Add environment variables:');
        console.log('      - TWILIO_ACCOUNT_SID');
        console.log('      - TWILIO_AUTH_TOKEN');
        console.log('      - TWILIO_PHONE_NUMBER');
        console.log('      - NETLIFY_DATABASE_URL\n');
    } catch (error) {
        console.log('\n❌ Error writing .env.local:', error.message);
    }

    rl.close();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { question };
