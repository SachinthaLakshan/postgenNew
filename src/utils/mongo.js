// utils/mongo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

let cachedClient = null;

export async function connectToDB() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  cachedClient = await client.connect();
  return cachedClient;
}
