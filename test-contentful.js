require('dotenv').config({ path: '.env' });
const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function run() {
  const allRes = await client.getEntries({
    content_type: 'blogPost',
    select: 'fields.title,fields.author,fields.tags'
  });
  console.log("All authors and tags:");
  allRes.items.forEach(i => console.log(i.fields.title, '| Author:', i.fields.author, '| Tags:', i.fields.tags));

  const guestRes = await client.getEntries({
    content_type: 'blogPost',
    'fields.tags[in]': 'Guest',
    select: 'fields.title,fields.tags'
  });
  console.log("Filtered by fields.tags[in]=Guest:", guestRes.items.length);
  
  const guestRes2 = await client.getEntries({
    content_type: 'blogPost',
    'fields.tags[match]': 'Guest',
    select: 'fields.title,fields.tags'
  });
  console.log("Filtered by fields.tags[match]=Guest:", guestRes2.items.length);
  
  const guestRes3 = await client.getEntries({
    content_type: 'blogPost',
    'fields.tags': 'Guest',
    select: 'fields.title,fields.tags'
  });
  console.log("Filtered by fields.tags=Guest:", guestRes3.items.length);
  
  const guestPostRes = await client.getEntries({
    content_type: 'blogPost',
    'fields.tags[match]': 'guest post',
    select: 'fields.title,fields.tags'
  });
  console.log("Filtered by guest post:", guestPostRes.items.length);
}

run().catch(console.error);
