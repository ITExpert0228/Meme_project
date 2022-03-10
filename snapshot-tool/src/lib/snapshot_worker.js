const { workerData, isMainThread, parentPort } = require("worker_threads");
const { getSnapshotByWallet } = require("./snapshot");
const { connectDb } = require("./db");
const { loadLiquidityData } = require("./repo");

const iterate = async () => {
  const accounts = workerData.data;
  const block = workerData.block;
  await loadLiquidityData(block);

  let fulfilled = 0;
  let rejected = 0;
  for (const a of accounts) {
    try {
      await getSnapshotByWallet(a, block);
      fulfilled += 1;
      parentPort.postMessage({ type: "inc" });
    } catch (err) {
      rejected += 1;
    }
  }
  const msg = {
    type: "stats",
    data: {
      fulfilled,
      rejected,
    },
  };
  parentPort.postMessage(msg);
  parentPort.close();
};

if (!isMainThread) {
  connectDb().then(() => {
    iterate();
  });
}
