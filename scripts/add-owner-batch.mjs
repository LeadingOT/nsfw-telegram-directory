import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/siteverification'],
});

// All verified sites
const domains = [
  'accountingai.tools',
  'aigirlfriend.tools',
  'bestanime.info',
  'bestnootropics.info',
  'bestofpodcasts.com',
  'bestonlyfans.info',
  'bestwriting.tools',
  'hrai.tools',
  'legalai.tools',
  'mattressrank.info',
  'nsfwtelegrambot.com',
  'realestateai.tools',
];

const newOwnerEmail = 'billliu971031@gmail.com';

async function run() {
  const authClient = await auth.getClient();
  const siteVerification = google.siteVerification({ version: 'v1', auth: authClient });

  for (const domain of domains) {
    const siteUrl = `https://${domain}/`;
    console.log(`\n=== ${domain} ===`);
    
    try {
      // Get current WebResource
      const getResponse = await siteVerification.webResource.get({
        id: siteUrl,
      });
      
      const currentOwners = getResponse.data.owners || [];
      
      if (currentOwners.includes(newOwnerEmail)) {
        console.log(`✅ Already an owner`);
        continue;
      }
      
      // Add new owner
      const updatedOwners = [...currentOwners, newOwnerEmail];
      
      await siteVerification.webResource.update({
        id: siteUrl,
        requestBody: {
          site: getResponse.data.site,
          owners: updatedOwners,
        },
      });
      
      console.log(`✅ Added ${newOwnerEmail}`);
      
    } catch (e) {
      console.log(`❌ Error: ${e.message}`);
    }
  }
  
  console.log('\n🎉 All done!');
}

run();
