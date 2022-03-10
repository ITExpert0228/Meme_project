const accountModule = require("../modules/account");
const blockModule = require("../modules/block");

(async () => {
  const from = process.argv[2];
  const to = process.argv[3];
  const start = process.argv[4];

   //let accounts = await accountModule.getAccounts(from, to);
   //console.log(accounts);
  
  //let bal = await accountModule.getBalance('0xB1680024814a666412DcB21703Adcdd46df7d17E',13602868);
  //console.log(bal);

  //bals = await accountModule.getBalances(13600868, 13601868, 13601868);
  bals = await accountModule.getBalances();
  console.log(bals);

  // num = await blockModule.earlistContractBlockNumber();
  // console.log(num);

  process.exit(0);
})();
