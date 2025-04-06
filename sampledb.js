import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'test';
let client;

async function connect() {
  client = new MongoClient(url);
  await client.connect();
  console.log('Connected to MongoDB');
}

export function getDatabase() {
  if (!client) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return client.db(dbName);
}

async function fetchData() {
  const db = getDatabase();
  const data = await db.collection('datacollection').find().toArray();
  
  // Normalize volunteerDetails field
  const normalizedData = data.map(doc => ({
    ...doc,
    volunteerDetails: Array.isArray(doc.volunteerDetails) ? doc.volunteerDetails : doc.volunteerDetails ? [doc.volunteerDetails] : []
  }));
  
  return normalizedData;
}

async function main() {
  try {
    await connect();
    const data = await fetchData();
    console.log('Fetched data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

main();