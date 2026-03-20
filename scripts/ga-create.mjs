// Auto-create GA4 property for a domain
// Usage: node ga-create.mjs <domain>

import { google } from 'googleapis';
import fs from 'fs';

const creds = JSON.parse(fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8'));
const auth = new google.auth.GoogleAuth({ credentials: creds, scopes: ['https://www.googleapis.com/auth/analytics.edit'] });

const [,, domain] = process.argv;
if (!domain) { console.log('Usage: node ga-create.mjs <domain>'); process.exit(1); }

async function run() {
  const client = await auth.getClient();
  const admin = google.analyticsadmin({ version: 'v1beta', auth: client });

  // List accounts
  const { data: { accounts } } = await admin.accounts.list();
  const account = accounts[0].name;

  // Create property
  const { data: property } = await admin.properties.create({
    requestBody: {
      parent: account,
      displayName: domain,
      timeZone: 'America/Los_Angeles',
      currencyCode: 'USD',
      industryCategory: 'TECHNOLOGY',
    },
  });
  console.log(`✅ Property created: ${property.name} (${property.displayName})`);

  // Create web data stream
  const { data: stream } = await admin.properties.dataStreams.create({
    parent: property.name,
    requestBody: {
      type: 'WEB_DATA_STREAM',
      displayName: domain,
      webStreamData: {
        defaultUri: `https://${domain}`,
      },
    },
  });
  
  const measurementId = stream.webStreamData?.measurementId;
  console.log(`✅ Measurement ID: ${measurementId}`);
  console.log(`\nAdd to site <head>:`);
  console.log(`<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>`);
  console.log(`<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}');</script>`);
}

run().catch(e => console.error('Error:', e.message));
