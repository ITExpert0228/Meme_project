const { getDb } = require("./db");

const getMintsByWallet = async (wallet, blockTimestamp) => {
  const db = getDb().db("ff-index-dev");
  const mintsCollection = db.collection("AddLiquidity");
  const burnsCollection = db.collection("RemoveLiquidity");

  const mints = await mintsCollection
    .find({ from: wallet, timestamp: { $lte: blockTimestamp } })
    .toArray();
  const burns = await burnsCollection
    .find({ from: wallet, timestamp: { $lte: blockTimestamp } })
    .toArray();

  const totalMint = mints.reduce((a, b) => a.amount0 + b.amount0);
  const totalBurn = burns.reduce((a, b) => a.amount0 + b.amount0);

  const total = totalMint - totalBurn;
  return total ? total : 0;
};

const updateSnapshotData = async (wallet, data, blockNumber) => {
  // TODO create collection for block
  const db = getDb().db("snap");
  const walletsCollection = db.collection(`snapshot-${blockNumber}`);
  await walletsCollection.insertOne({
    wallet: wallet,
    totalSgb: data.total,
    collateral: data.collateral,
    stakedInLiquidity: data.stakedInLiquidity,
    shib: data.shib,
    sgb: data.sgb,
  });
};

const saveLiquidityData = async (accounts, blockNumber) => {
  const db = getDb().db("snap");
  const walletsCollection = db.collection(`snapshot-${blockNumber}-liquidity`);
  await walletsCollection.insertMany(
    Object.keys(accounts).map((a) => ({
      address: a,
      value: accounts[a],
    }))
  );
};

const loadLiquidityData = async (blockNumber) => {
  const db = getDb().db("snap");
  const walletsCollection = db.collection(`snapshot-${blockNumber}-liquidity`);
  const wallets = await walletsCollection.find({}).toArray();
  return wallets;
};

const getAllAccounts = async () => {
  // TODO calculate from transactions collection
  const db = getDb().db("flare");
  const txsCollection = db.collection("songbird.prod-transactions");

  const txs = await txsCollection.find({}).toArray();
  const wallets = [];
  // TODO check if account already in collection
  for (const tx of txs) {
    const walletsFromTx = [tx.from, tx.to];
    for (const w of walletsFromTx) {
      if (!wallets.includes(w)) {
        wallets.push()
      }
    }
  }
  return wallets;
};

module.exports = {
  getMintsByWallet,
  updateSnapshotData,
  getAllAccounts,
  saveLiquidityData,
  loadLiquidityData,
};
