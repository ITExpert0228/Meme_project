const { Worker } = require("worker_threads");
const cliProgress = require("cli-progress");
const { getLogger } = require("./logger");

const workerFiles = {
  accounts: "./src/lib/snapshot_worker.js",
  liquidity: "./src/lib/logs_worker.js",
};

const runIteration = (data, options) => {
  const logger = getLogger();

  return new Promise(async (resolve) => {
    const { threads, block, type } = options;
    const workerPath = workerFiles[type];
    if (!workerPath) {
      throw new Error("No worker specified ! ");
    }

    const chunks = makeChunks(data, threads);
    let accounts = {};

    console.log(`Starting on ${chunks.length} chunks`);

    const promises = [];
    const stats = [];
    const progress = getProgressBar();
    for (const chunk of chunks) {
      const promise = new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, {
          workerData: { data: chunk, block },
        });

        const bar = progress.create(chunk.length, 0, worker.threadId);
        bar.start(chunk.length, 0);

        worker.on("error", (err) => {
          // TODO add error data
          logger.error(err);
          reject(err);
        });

        worker.on("message", (msg) => {
          if (msg.type === "result") {
            // TODO sync data
            // accounts = { ...accounts, ...accsMsg.data };
            const walletsFromResults = msg.data;
            increaseOrInsert(accounts, walletsFromResults);
          } else if (msg.type === "inc") {
            bar.increment();
          } else if (msg.type === "stats") {
            stats.push({
              threadId: worker.threadId,
              data: {
                fulfilled: msg.data.fulfilled,
                rejected: msg.data.rejected,
              },
            });
            bar.stop();
            worker.unref();
            resolve();
          }
        });
        worker.on("exit", () => {
          bar.stop();
          resolve();
        });
      });
      promises.push(promise);
    }
    // TODO calculate loose
    await Promise.all(promises);
    progress.stop();
    console.dir(stats);
    resolve(accounts);
  });
};

const getProgressBar = () => {
  const progress = new cliProgress.MultiBar(
    { clearOnComplete: true, hideCursor: false },
    cliProgress.Presets.legacy
  );

  return progress;
};

const makeChunks = (data, chunkNumber) => {
  const chunkSize = Math.floor(data.length / chunkNumber);
  const chunks = [];
  // TODO don`t miss any data
  for (let i = 0; i < chunkNumber; i++) {
    const logsToParse = data.slice(i * chunkSize, (i + 1) * chunkSize);
    chunks.push(logsToParse);
  }

  return chunks;
};

const increaseOrInsert = (accounts, accs) => {
  for (let acc of Object.keys(accs)) {
    if (accounts[acc]) {
      accounts[acc] += accs[acc];
    } else {
      accounts[acc] = accs[acc];
    }
  }
};

module.exports = runIteration;
