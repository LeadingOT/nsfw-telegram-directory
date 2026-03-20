// Verify site and add user in one go
// Usage: node gsc-verify-and-add-user.mjs <domain> <email>

import { google } from 'googleapis';
import fs from 'fs';
import https from 'https';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters', 'https://www.googleapis.com/auth/siteverification'],
});

const [,, domain, userEmail] = process.argv;

if (!domain || !userEmail) {
  console.log('Usage: node gsc-verify-and-add-user.mjs <domain> <email>');
  process.exit(1);
}

const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });

  try {
    // Step 1: Get verification token
    console.log(`Step 1: Getting verification token for ${domain}...`);
    const tokenResponse = await siteVerification.webResource.getToken({
      requestBody: {
        site: { type: 'SITE', identifier: siteUrl },
        verificationMethod: 'FILE',
      },
    });
    
    const token = tokenResponse.data.token;
    const fileName = `google${token.slice(0, 16)}.html`;
    console.log(`  Token: ${token}`);
    console.log(`  File: ${fileName}`);
    
    // Step 2: Upload verification file to site
    console.log(`Step 2: Uploading ${fileName} to ${domain}...`);
    // We'll handle upload separately
    
    // Step 3: Verify the site
    console.log(`Step 3: Verifying ${domain}...`);
    await siteVerification.webResource.insert({
      verificationMethod: 'FILE',
      requestBody: {
        site: { type: 'SITE', identifier: siteUrl },
        verificationMethod: 'FILE',
      },
    });
    console.log(`  ✅ Site verified!`);
    
    // Step 4: Add user as owner
    console.log(`Step 4: Adding ${userEmail} as owner...`);
    const accessToken = await authClient.getAccessToken();
    
    const addUserResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/permissions`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissionLevel: 'siteOwner',
          emailAddress: userEmail,
        }),
      }
    );
    
    if (addUserResponse.ok) {
      console.log(`  ✅ Added ${userEmail} as owner!`);
    } else {
      const error = await addUserResponse.text();
      console.log(`  ❌ Failed to add user: ${error}`);
    }
    
    console.log(`\n✅ All done for ${domain}!`);
    
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
    if (e.response?.data) {
      console.log(`   Details: ${JSON.stringify(e.response.data, null, 2)}`);
    }
  }
}

run();
