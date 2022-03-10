const { MongoClient } = require("mongodb");
const dotnev = require("dotenv-safe");
dotnev.config(
  {
      allowEmptyValues: true
  }
);
const MONGO_DB = process.env.MONGO_DB;

let db;

const connectDb = async () => {
  db = new MongoClient(MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize : 10, 
    // maxPoolSize : 20
  });
  await db.connect();
};

const getDb = () => {
  return db;
};

module.exports = { connectDb, getDb };
