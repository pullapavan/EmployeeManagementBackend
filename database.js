const MongoClient = require("mongodb/lib/mongo_client");

const uri =
  process.env.DB_URL ||
  "";

let db;
async function connectToDb() {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  await client.connect();
  console.log("Connected to Database Successfully...", uri);
  db = client.db();

  return true;
}

module.exports = {
  connectToDb,
  getDB: () => {
    return db;
  },
};
