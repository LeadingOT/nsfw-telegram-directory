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
  'accountingai.tools',
  'aigirlfriend.tools',
  'bestanime.info',
  'bestofpodcasts.com',
  'bestonlyfans.info',
  'bestwriting.tools',
  'mattressrank.info',
  'nsfwtelegrambot.com',
  'realestateai.tools',
];

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  for (const domain of domains) {
    const siteUrl = `https://${domain}/`;
    try {
      const response = await siteVerification.webResource.get({ id: siteUrl });
      const owners = response.data.owners || [];
      const hasBill = owners.includes('billliu971031@gmail.com');
      console.log(`${domain}: ${hasBill ? '✅' : '❌'} (${owners.length} owners)`);
    } catch (e) {
      console.log(`${domain}: ❌ Error - ${e.message}`);
    }
  }
}

run();
