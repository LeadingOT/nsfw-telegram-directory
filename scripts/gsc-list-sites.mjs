import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

async function run() {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });

  try {
    const response = await webmasters.sites.list();
    console.log('Sites visible to service account:');
    if (response.data.siteEntry) {
      response.data.siteEntry.forEach(site => {
        console.log(`  - ${site.siteUrl} (${site.permissionLevel})`);
      });
    } else {
      console.log('  (no sites found)');
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

run();
