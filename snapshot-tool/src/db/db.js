const { MongoClient } = require("mongodb");
const env = require("../config/env");
const MONGO_DB = env.MONGO_DB;

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
