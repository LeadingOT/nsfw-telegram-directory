// Verify a single site
import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/siteverification'],
});

const [,, domain] = process.argv;

if (!domain) {
  console.log('Usage: node gsc-verify-site.mjs <domain>');
  process.exit(1);
}

const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  try {
    await siteVerification.webResource.insert({
      verificationMethod: 'FILE',
      requestBody: {
        site: { type: 'SITE', identifier: siteUrl },
        verificationMethod: 'FILE',
      },
    });
    console.log(`✅ ${domain} verified!`);
  } catch (e) {
    console.log(`❌ ${domain}: ${e.message}`);
  }
}

run();
