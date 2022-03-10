const { getDb } = require("./db");
const { exponentTenToDecrease, exponentTenToIncrease } = require("./utils");
const { getWeb3 } = require("./web3");
const iterate = require("./iteration");
const {
  getLogs,
  saveLiquidityData,
  getLiqudityData,
  getLogsForEvents,
} = require("./cache");
const { getLogger } = require("./logger");
/**
 * loads mint and burn liquidity events
 */

const mintEvent =
  "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f";
const burnEvent =
  "0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496";
const pairAddress = "0x32c16bA8A4B1f2501A16bcdAF53b51Fb982eAec4";
const accounts = {};

const loadLiquidityEvents = async (blockNumber, threads) => {
  const logger = getLogger();
  const logs = await getLogsForEvents([mintEvent, burnEvent]);
  logger.info(`${logs.length} logs was found`);
  // TODO remove limit
  const accounts = await iterate(logs, {
    block: blockNumber,
    threads: threads,
    type: "liquidity",
  });

  // console.dir(accounts);
  await saveLiquidityData(accounts, blockNumber);
};

const loadLiquidityData = async (blockNumber) => {
  const wallets = await getLiqudityData();
  for (const w of wallets) {
    accounts[w.address] = w.value;
  }
};

const getAccountStake = (wallet) => {
  return accounts[wallet] || 0;
};

module.exports = { getAccountStake, loadLiquidityEvents, loadLiquidityData };
