// Google Search Console automation
// Usage: node gsc-auto.mjs <action> <domain>
// Actions: add, verify, sitemap

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters'],
});

const [,, action, domain] = process.argv;

if (!action || !domain) {
  console.log('Usage: node gsc-auto.mjs <add|verify|sitemap> <domain>');
  process.exit(1);
}

const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  switch (action) {
    case 'add': {
      // Add site to Search Console
      try {
        await webmasters.sites.add({ siteUrl });
        console.log(`✅ Added ${domain} to Search Console`);
      } catch (e) {
        console.log(`Error adding site: ${e.message}`);
      }
      break;
    }
    case 'verify': {
      // Get verification token
      try {
        const token = await siteVerification.webResource.getToken({
          requestBody: {
            site: { type: 'SITE', identifier: siteUrl },
            verificationMethod: 'FILE',
          },
        });
        console.log(`Verification token:`, JSON.stringify(token.data, null, 2));
      } catch (e) {
        console.log(`Error getting token: ${e.message}`);
      }
      break;
    }
    case 'sitemap': {
      // Submit sitemap
      try {
        await webmasters.sitemaps.submit({
          siteUrl,
          feedpath: `${siteUrl}sitemap-index.xml`,
        });
        console.log(`✅ Sitemap submitted for ${domain}`);
      } catch (e) {
        console.log(`Error submitting sitemap: ${e.message}`);
      }
      break;
    }
    case 'list': {
      // List all sites
      try {
        const res = await webmasters.sites.list();
        console.log('Sites:', JSON.stringify(res.data, null, 2));
      } catch (e) {
        console.log(`Error listing sites: ${e.message}`);
      }
      break;
    }
    default:
      console.log(`Unknown action: ${action}`);
  }
}

run().catch(console.error);
