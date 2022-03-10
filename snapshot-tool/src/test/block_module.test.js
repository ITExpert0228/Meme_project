const blockModule = require("../modules/block");

(async () => {
  const blockNumber = process.argv[2];
  let block = await blockModule.getBlockExt(blockNumber);
  console.dir(block);

  process.exit(0);
})();
