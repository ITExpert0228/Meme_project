const { getAccounts } = require("./blocks");
const iteration = require("./iteration");
const { loadLiquidityData, loadLiquidityEvents } = require("./liquidity");

const parse = async (blockNumber, threads) => {
  const accounts = await getAccounts(blockNumber);
  console.log(`Start with ${accounts.length} accounts`);
  await loadLiquidityEvents(blockNumber, threads);
  iteration(accounts, {
    block: blockNumber,
    threads: threads,
    type: "accounts",
  });
};

module.exports = { parse };
