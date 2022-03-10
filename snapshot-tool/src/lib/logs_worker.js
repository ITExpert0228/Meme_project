const {
  workerData,
  isMainThread,
  parentPort,
  threadId,
} = require("worker_threads");
const { getWeb3 } = require("./web3");
const { exponentTenToDecrease } = require("./utils");
const { createLogger } = require("./logger");

const mintEvent =
  "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f";
const burnEvent =
  "0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496";

const iterate = async () => {
  // need to create logger here, cause that method running in different thread
  const logger = createLogger();
  let logs = workerData.data;
  const web3 = getWeb3();
  // FIXME accounts can duplicate and need to sync that when handling result from thread
  // TODO add success log (in iteration )
  // TODO add error log (in iteration)
  const accounts = {};
  for (let log of logs) {
    // filler events
    if (log.topics[0] != mintEvent && log.topics[0] != burnEvent) {
      continue;
    }

    const tx = await web3.eth.getTransaction(log.transactionHash);
    const from = tx.from;

    const decoded = await web3.eth.abi.decodeLog(
      [
        { type: "uint256", name: "amount0" },
        { type: "uint256", name: "amount1" },
      ],
      log.data
    );
    const amount0 = Number(exponentTenToDecrease(decoded.amount0, 18));

    if (log.topics[0] == mintEvent) {
      if (accounts[from]) {
        accounts[from] += amount0;
      } else {
        accounts[from] = amount0;
      }
    } else {
      if (accounts[from]) {
        accounts[from] -= amount0;
      } else {
        accounts[from] = amount0;
      }
    }
    parentPort.postMessage({ type: "inc", data: Object.keys(accounts).length });
    logger.success(
      `transaction : ${log.transactionHash} mint event : accounts : ${from} amonut : ${amount0}`
    );
  }
  parentPort.postMessage({ type: "result", data: accounts });
};

if (!isMainThread) {
  iterate();
}
