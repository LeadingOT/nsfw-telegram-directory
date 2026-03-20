import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters'],
});

const domain = 'bestanime.info';
const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });

  try {
    // Try to add the site to Search Console
    await webmasters.sites.add({ siteUrl });
    console.log(`✅ Added ${domain} to Search Console`);
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log(`✅ ${domain} already in Search Console`);
    } else {
      console.log(`Error: ${e.message}`);
    }
  }
  
  // Now check site info
  try {
    const siteInfo = await webmasters.sites.get({ siteUrl });
    console.log(`Permission level: ${siteInfo.data.permissionLevel}`);
  } catch (e) {
    console.log(`Cannot get site info: ${e.message}`);
  }
}

run();
