// Get verification tokens for all domains
import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/siteverification'],
});

const domains = [
  'bestanime.info',
  'bestonlyfans.info',
  'bestofpodcasts.info',
  'bestwriting.info',
  'mattressrank.info',
  'nsfw-telegram.info',
];

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  const tokens = {};
  
  for (const domain of domains) {
    const siteUrl = `https://${domain}/`;
    try {
      const response = await siteVerification.webResource.getToken({
        requestBody: {
          site: { type: 'SITE', identifier: siteUrl },
          verificationMethod: 'FILE',
        },
      });
      const token = response.data.token;
      tokens[domain] = token;
      console.log(`${domain}: ${token}`);
    } catch (e) {
      console.log(`${domain}: ERROR - ${e.message}`);
    }
  }
  
  // Save to file
  fs.writeFileSync('/tmp/gsc-tokens.json', JSON.stringify(tokens, null, 2));
  console.log('\nTokens saved to /tmp/gsc-tokens.json');
}

run();
