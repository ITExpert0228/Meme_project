const { getWeb3 } = require("./web3");
const {
  getLatestBlockNumber,
  saveDataForBlock,
  getUnparsedBlocks,
} = require("./cache");
const { getLogger } = require("./logger");

const web3 = getWeb3();

const getBlockTxs = async (blockNumber) => {
  const block = await web3.eth.getBlock(blockNumber, true);
  const logs = [];

  const txs = block.transactions.map((tx) => ({
    ...tx,
    timestamp: block.timestamp,
  }));

  const hashes = txs.map((t) => t.hash);
  let receipts = await batchGetTransactionReceipts(hashes);
  receipts = receipts.filter((t) => t !== null);
  if (receipts.length !== txs.length)
    throw new Error(
      "Error updating gasUsed. Receipt and transaction length missmatch (fork?)"
    );

  receipts.forEach((r) => {
    r.logs.forEach((l) => {
      logs.push(l);
    });
  });

  return {
    ...block,
    transactions: txs,
    receipts: receipts,
    logs: logs,
  };
};

// #region utility
const splitBatch = (a) => {
  const batch_size = 50;
  let b = [...a]; // clone
  let arrays = [];
  while (b.length > 0) arrays.push(b.splice(0, batch_size));
  return arrays;
};
const batchGetTransactionReceipts = async (transactions) => {
  let batch_promises = [];
  let arrays = splitBatch(transactions);
  arrays.forEach((a) => {
    let batch = new web3.eth.BatchRequest();
    a.forEach((txn) => {
      batch_promises.push(
        new Promise((resolve, reject) => {
          // @ts-ignore
          batch.add(
            web3.eth.getTransactionReceipt.request(txn, (err, response) => {
              if (err) reject(err);
              resolve(response);
            })
          );
        })
      );
    });
    batch.execute();
  });

  return Promise.all(batch_promises);
};
// #endregion

const getAccounts = async (lastBlock) => {
  const logger = getLogger();
  const blockNumbers = await getUnparsedBlocks(lastBlock);
  const latestSavedBlock = blockNumbers[0];
  if (latestSavedBlock != 0) {
    logger.info(`Loading cache, starting from ${latestSavedBlock} block`);
  }
  // TODO fetch last block from db
  const wallets = [];
  const blockPromises = [];
  const callbacks = [];
  logger.info(`Start parsing blocks ${blockNumbers.length}`);
  for (const blockNumber of blockNumbers) {
    const blockCallback = () => {
      return new Promise(async (resolve, reject) => {
        let blockData;
        try {
          blockData = await getBlockTxs(blockNumber);
        } catch (err) {
          if (err.message.includes("Invalid JSON RPC response")) {
            if (!blockNumbers.includes(blockNumber)) {
              blockNumbers.push(blockNumber);
            }
            return resolve();
          }
          logger.error(err);
          return reject(err);
        }

        for (const tx of blockData.transactions) {
          const walletsFromTx = [tx.from, tx.to];
          for (const w of walletsFromTx) {
            if (!wallets.includes(w) && w) {
              wallets.push(w);
            }
          }
        }

        await saveDataForBlock(
          blockNumber,
          blockData.logs,
          blockData.transactions,
          wallets
        );

        logger.success(
          `block : ${blockNumber} , logs : ${blockData.logs.length}`
        );
        logger.success(
          `block : ${blockNumber} , transactions : ${blockData.transactions.length}`
        );
        logger.success(
          `block : ${blockNumber} , totalWallet : ${wallets.length}`
        );
        return resolve();
      });
    };
    // blockPromises.push(promise);
    callbacks.push(blockCallback);
  }

  const chunks = makeChunks(callbacks, 100);
  for (const chunk of chunks) {
    await Promise.all(chunk.map((c) => c()));
  }
  logger.info(`Blocks parsed walletsTotal : ${wallets.length}`);
  return wallets;
};

const makeChunks = (data, chunkSize) => {
  const chunks = [];
  while (data.length) {
    chunks.push(data.splice(0, chunkSize));
  }

  return chunks;
};
module.exports = {
  getAccounts,
};
