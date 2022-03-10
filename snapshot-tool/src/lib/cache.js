const { getDb } = require("./db");
let logs = [];
let transactions = [];
let accounts;

let db;
let logsCollection;
let transactionsCollection;
let blocksCollection;
let walletsCollection;
let liquidityCollection;
let blockNumber;

const init = (block) => {
  db = getDb().db("snap");
  logsCollection = db.collection("logs");
  transactionsCollection = db.collection("transactions");
  blocksCollection = db.collection("blocks");
  walletsCollection = db.collection("wallets");
  liquidityCollection = db.collection("liquidity");
  blockNumber = Number(block);
};

// #region Block parsing functions

const saveDataForBlock = async (
  blockNumber,
  logsFromBlock,
  txsFromBlock,
  walletsFromBlock
) => {
  await blocksCollection.insertOne({
    number: blockNumber,
    logs: logsFromBlock,
    transactions: txsFromBlock,
    wallets: walletsFromBlock,
  });
};

const saveLogsForBlock = async (logsFromBlock) => {
  logs.push(...logsFromBlock);
  if (!logsFromBlock.length) return;
  await logsCollection.insertMany(logsFromBlock);
};

const saveTxsForBlock = async (txs) => {
  transactions.push(...txs);
  if (!txs.length) return;
  await transactionsCollection.insertMany(txs);
};

const saveWallets = async (wallets) => {
  const walletObject = wallets.map((w) => ({ wallet: w }));
  if (!walletObject.length) return;
  await walletsCollection.insertMany(walletObject);
};

const saveBlock = async (blockNumber) => {
  await blocksCollection.insertOne({ number: blockNumber });
};

const getLogs = async () => {
  // TODO if available - return logs, else load from db
  if (logs.length) return logs;
  // logs = await logsCollection.find({}).toArray();
  const blocks = await blocksCollection
    .find({ number: { $lte: blockNumber } })
    .toArray();
  for (const block of blocks) {
    logs.push(...block.logs);
  }
  return logs;
};

const getLogsForEvents = async (events) => {
  const blocks = await blocksCollection
    .find({
      number: { $lte: blockNumber },
      "logs.topics.0": { $in: events },
    })
    .toArray();
  for (const block of blocks) {
    logs.push(...block.logs);
  }
  return logs;
};
const getWallets = async () => {
  // TODO if available - return logs, else load from db
  if (accounts) return accounts;
  const blocks = await blocksCollection
    .find({ number: { $lte: blockNumber } })
    .toArray();
  for (const block of blocks) {
    accounts.push(...block.wallets);
  }
  return wallets;
};
// TODO add method to return unprocessed blocks
// TODO prevent duplicates
const getLatestBlockNumber = async () => {
  const blocks = await blocksCollection
    .find({})
    .sort({ number: -1 })
    .limit(1)
    .toArray();

  const block = blocks[0];

  if (!block) {
    return 0;
  }
  return block.number;
};

const getUnparsedBlocks = async (lastBlock) => {
  let blocksParsed = await blocksCollection.find({}).toArray();
  blocksParsed = blocksParsed.map((b) => b.number);
  let lastSaved = blocksParsed[0];
  if (!lastSaved) {
    lastSaved = 0;
  }

  const allBlocksToLast = [];
  for (let i = lastSaved; i < lastBlock; i++) {
    allBlocksToLast.push(i);
  }
  const blocksToParse = [];
  for (const block of allBlocksToLast) {
    if (blocksParsed.includes(block)) {
      continue;
    } else {
      blocksToParse.push(block);
    }
  }

  return blocksToParse.sort((a, b) => a < b);
};
// #endregion

const saveLiquidityData = async (accs) => {
  accounts = accs;
  const dbObjects = [];
  for (const wallet of Object.keys(accounts)) {
    dbObjects.push({
      wallet,
      value: accounts[wallet],
    });
  }
  await liquidityCollection.insertMany(dbObjects);
};

const getLiqudityData = async () => {
  // TODO check last log when data was saved
  const liquidityData = await liquidityCollection.find({}).toArray();
  for (const accInfo of liquidityData) {
    accounts[accInfo.wallet] = accInfo.value;
  }
  return accounts;
};

module.exports = {
  init,
  getLogs,
  getLiqudityData,
  saveLiquidityData,
  getWallets,
  getLatestBlockNumber,
  saveDataForBlock,
  getUnparsedBlocks,
  getLogsForEvents,
};
