import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;
const client = new MongoClient(uri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

let db: Db | null = null;

async function connect(): Promise<void> {
  await client.connect();
  db = client.db(process.env.MONGO_INITDB_DATABASE);
}

function getDb(): Db {
  if (!db) {
    throw new Error(
      "Database not initialized. Did you forget to call connect first?",
    );
  }
  return db;
}

async function close(): Promise<void> {
  await client.close();
}

export { connect, getDb, close };
