import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters'],
});

const domains = [
  'bestanime.info',
  'bestonlyfans.info', 
  'mattressrank.info',
  'bestofpodcasts.com',
  'bestwriting.tools',
  'nsfwtelegrambot.com',
];

const userEmail = 'billliu971031@gmail.com';

async function run() {
  const authClient = await auth.getClient();
  const accessToken = await authClient.getAccessToken();

  for (const domain of domains) {
    const siteUrl = `https://${domain}/`;
    console.log(`Adding ${userEmail} to ${domain}...`);
    
    try {
      const response = await fetch(
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
      
      if (response.ok) {
        console.log(`  ✅ Success!`);
      } else {
        const error = await response.text();
        console.log(`  ❌ Failed: ${error}`);
      }
    } catch (e) {
      console.log(`  ❌ Error: ${e.message}`);
    }
  }
}

run();
