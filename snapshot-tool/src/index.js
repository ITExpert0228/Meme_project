const { connectDb } = require("./lib/db");
const liquidity = require("./lib/liquidity");
const accounts = require("./lib/accounts");
const { getSnapshotByWallet } = require("./lib/snapshot");
const { getAccounts } = require("./lib/blocks");
const { createLogger, getLogger } = require("./lib/logger");
const cache = require("./lib/cache");
/**
 * liquidity - iterate mint / burn liquidity logs
 * snapshot - take snapshot
 * wallet - snapshot by account
 * accounts - parse all accounts
 */
(async () => {
  
  const arg = process.argv[2];
  const block = process.argv[3];

  await connectDb();
  await cache.init(block)
  
  const logger = createLogger(block);
  if (arg == "liquidity") {
    await getAccounts(block);
    // TODO save parsed blocks !
    logger.info("accounts loaded");
    await liquidity.loadLiquidityEvents(block, 10);
  } else if (arg == "snapshot") {
    await accounts.parse(block, 30);
  } else if (arg == "wallet") {
    await getSnapshotByWallet(process.argv[4], block);
  } else if (arg === "accounts") {
    const accounts = await getAccounts(block);
    console.dir(accounts);
  } else {
    throw new Error("No argument specicified!");
  }

  process.exit(0);
})();
