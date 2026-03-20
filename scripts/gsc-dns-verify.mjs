// GSC DNS verification via Cloudflare
// Usage: node gsc-dns-verify.mjs <domain>
// 1. Gets verification token from GSC (DNS TXT method)
// 2. Adds TXT record via Cloudflare API
// 3. Waits and verifies

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const CF_TOKEN = 'FM8m59cNyAResuGg1NNi1nZkmaoH7LByujOdy8oU';
const CF_ACCOUNT = '1276b83ae1c8fabc20d6581e430a9eb5';

// Zone IDs from Bill's Cloudflare
const ZONES = {
  'hrai.tools': 'c4018aaae5e1d59ac4a8dcade77b35a2',
  'legalai.tools': 'aa2e75889ecf55e8911bda588f60c889',
  'accountingai.tools': 'dee5fbb2bb08ea623d872e9345c869b3',
  'aigirlfriend.tools': '20273f4d39512468194f85374b1ebbea',
  'bestnootropics.info': 'be1980943d73ac51c786998fdf5e9c77',
};

const domain = process.argv[2];
if (!domain) { console.log('Usage: node gsc-dns-verify.mjs <domain>'); process.exit(1); }

const zoneId = ZONES[domain];
if (!zoneId) { console.log(`No zone ID for ${domain}`); process.exit(1); }

const siteUrl = `https://${domain}/`;

async function cfApi(path, method = 'GET', body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: { 'Authorization': `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function run() {
  // Step 1: Get DNS verification token from GSC
  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/siteverification'],
  });
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  console.log(`🔍 Getting verification token for ${domain}...`);
  const tokenRes = await siteVerification.webResource.getToken({
    requestBody: {
      site: { type: 'INET_DOMAIN', identifier: domain },
      verificationMethod: 'DNS_TXT',
    },
  });
  const txtValue = tokenRes.data.token;
  console.log(`📝 TXT record value: ${txtValue}`);

  // Step 2: Add TXT record to Cloudflare
  console.log(`☁️ Adding TXT record to Cloudflare zone ${zoneId}...`);
  
  // Check if TXT record already exists
  const existing = await cfApi(`/zones/${zoneId}/dns_records?type=TXT&name=${domain}`);
  const existingRecord = existing.result?.find(r => r.content === txtValue);
  
  if (existingRecord) {
    console.log(`✅ TXT record already exists`);
  } else {
    const createRes = await cfApi(`/zones/${zoneId}/dns_records`, 'POST', {
      type: 'TXT',
      name: domain,
      content: txtValue,
      ttl: 1, // auto
    });
    if (createRes.success) {
      console.log(`✅ TXT record created`);
    } else {
      console.log(`❌ Failed to create TXT:`, JSON.stringify(createRes.errors));
      process.exit(1);
    }
  }

  // Step 3: Wait for DNS propagation
  console.log(`⏳ Waiting 10s for DNS propagation...`);
  await new Promise(r => setTimeout(r, 10000));

  // Step 4: Verify
  console.log(`🔑 Verifying ${domain}...`);
  try {
    const verifyRes = await siteVerification.webResource.insert({
      verificationMethod: 'DNS_TXT',
      requestBody: {
        site: { type: 'INET_DOMAIN', identifier: domain },
      },
    });
    console.log(`✅ ${domain} VERIFIED!`, JSON.stringify(verifyRes.data));
  } catch (e) {
    console.log(`❌ Verification failed: ${e.message}`);
    console.log(`   Try again in a few minutes (DNS may need more time)`);
  }

  // Step 5: Submit sitemap
  const wmAuth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });
  const wmClient = await wmAuth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: wmClient });
  
  try {
    await webmasters.sitemaps.submit({ siteUrl, feedpath: `${siteUrl}sitemap-index.xml` });
    console.log(`✅ Sitemap submitted for ${domain}`);
  } catch (e) {
    console.log(`⚠️ Sitemap submission failed (may need verified first): ${e.message}`);
  }
}

run().catch(e => console.error('Fatal:', e.message));
