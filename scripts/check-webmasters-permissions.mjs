import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const domain = 'bestanime.info';
const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });

  try {
    // List all permissions for this site
    const response = await webmasters.permissions.list({ siteUrl });
    
    console.log(`Permissions for ${domain}:`);
    if (response.data.permissionLevel) {
      response.data.permissionLevel.forEach(perm => {
        console.log(`  - ${perm.emailAddress}: ${perm.permissionLevel}`);
      });
    } else {
      console.log('  No permissions found (or no access)');
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
    if (e.code === 403) {
      console.log('  → Service account may not have permission to list/manage permissions');
    }
  }
}

run();
