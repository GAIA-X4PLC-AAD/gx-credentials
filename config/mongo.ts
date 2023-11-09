import { Db, MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

let clientPromise;

if (!process.env.MONGODB_URI) {
  console.log("Mongo db ri: ", process.env.MONGODB_URI);
  throw new Error("Please add your Mongo URI to .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts: MongoClientOptions = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };

  // Connect to cluster
  let client = new MongoClient(process.env.MONGODB_URI as string, opts);
  await client.connect();
  let db = client.db(process.env.MONGO_INITDB_DATABASE);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

const uri = process.env.MONGODB_URI;
const opts: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};
const client = new MongoClient(uri, opts);
cachedClient = client;
clientPromise = client.connect();
cachedDb = client.db(process.env.MONGO_INITDB_DATABASE);

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
