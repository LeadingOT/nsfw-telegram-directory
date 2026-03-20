import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/siteverification', 'https://www.googleapis.com/auth/webmasters'],
});

const domains = [
  'bestofpodcasts.com',
  'bestwriting.tools',
  'nsfwtelegrambot.com',
];

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });

  for (const domain of domains) {
    const siteUrl = `https://${domain}/`;
    console.log(`\n=== Processing ${domain} ===`);
    
    try {
      // Get token
      const tokenResponse = await siteVerification.webResource.getToken({
        requestBody: {
          site: { type: 'SITE', identifier: siteUrl },
          verificationMethod: 'FILE',
        },
      });
      const token = tokenResponse.data.token;
      console.log(`Token: ${token}`);
      
      // Check if file already exists
      const checkResponse = await fetch(`https://${domain}/${token}`);
      console.log(`File status: ${checkResponse.status}`);
      
      if (checkResponse.status === 200) {
        // Verify
        await siteVerification.webResource.insert({
          verificationMethod: 'FILE',
          requestBody: {
            site: { type: 'SITE', identifier: siteUrl },
            verificationMethod: 'FILE',
          },
        });
        console.log(`✅ Verified!`);
      } else {
        console.log(`⚠️  Verification file not found, needs upload`);
      }
      
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

run();
