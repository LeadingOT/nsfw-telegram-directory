// Add user permissions to GSC property via HTTP API
// Usage: node gsc-add-user.mjs <domain> <email>

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters'],
});

const [,, domain, userEmail] = process.argv;

if (!domain || !userEmail) {
  console.log('Usage: node gsc-add-user.mjs <domain> <email>');
  process.exit(1);
}

const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  
  try {
    // Use direct HTTP request
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/permissions`;
    
    const response = await authClient.request({
      url,
      method: 'POST',
      data: {
        emailAddress: userEmail,
        permissionLevel: 'siteOwner',
      },
    });
    
    console.log(`✅ Added ${userEmail} as owner of ${domain}`);
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
    if (e.response?.data) {
      console.log(`   Details: ${JSON.stringify(e.response.data)}`);
    }
  }
}

run();
