// Add owner to GSC site using Site Verification API
import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/siteverification'],
});

const [,, domain, newOwnerEmail] = process.argv;

if (!domain || !newOwnerEmail) {
  console.log('Usage: node gsc-add-owner.mjs <domain> <email>');
  process.exit(1);
}

const siteUrl = `https://${domain}/`;

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  try {
    // Step 1: Get current WebResource
    console.log(`Step 1: Getting current owners for ${domain}...`);
    const getResponse = await siteVerification.webResource.get({
      id: siteUrl,
    });
    
    const currentOwners = getResponse.data.owners || [];
    console.log(`  Current owners: ${currentOwners.join(', ')}`);
    
    // Step 2: Add new owner to the list
    if (currentOwners.includes(newOwnerEmail)) {
      console.log(`  ✅ ${newOwnerEmail} is already an owner!`);
      return;
    }
    
    const updatedOwners = [...currentOwners, newOwnerEmail];
    console.log(`  Adding ${newOwnerEmail}...`);
    
    // Step 3: Update WebResource with new owners list
    await siteVerification.webResource.update({
      id: siteUrl,
      requestBody: {
        site: getResponse.data.site,
        owners: updatedOwners,
      },
    });
    
    console.log(`✅ Successfully added ${newOwnerEmail} as owner of ${domain}`);
    
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
    if (e.response?.data) {
      console.log(`   Details: ${JSON.stringify(e.response.data, null, 2)}`);
    }
  }
}

run();
