import { Db, MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.log("Mongo db ri: ", process.env.MONGODB_URI);
  throw new Error("Please add your Mongo URI to .env.local");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase():Promise<{client: MongoClient; db: Db}> {
  try {
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
    const client = new MongoClient(process.env.MONGODB_URI as string, opts);
    await client.connect();
    const db = client.db(process.env.MONGO_INITDB_DATABASE);

    // Send a ping to confirm a successful connection
    await client
      .db(process.env.MONGO_INITDB_ROOT_USERNAME)
      .command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {
      client: cachedClient,
      db: cachedDb,
    };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error; // or handle error as needed
  }
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
const clientPromise = client.connect();
cachedDb = client.db(process.env.MONGO_INITDB_DATABASE);

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
