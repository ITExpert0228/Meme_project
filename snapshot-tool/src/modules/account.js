const { getWeb3, getWeb3Contract, promisify } = require("../config/web3_conf");
const utils = require("../libs/utils");
var constants = require("../config/constants");

const blockModule = require("./block");
const web3 = getWeb3();
const web3_contract = getWeb3Contract();


const getBalance = async (address, blockNumber = null) => {
  let latest =  await blockModule.latestBlockNumber();
  if(latest<blockNumber || !blockNumber)
    blockNumber = latest;
  let bal = await promisify(callback => web3.eth.getBalance(address, blockNumber, callback));
  let nbal = Number(utils.exponentTenToDecrease(bal, constants.DIGITS,constants.DECIMAL));
  return nbal;
}
const getWBalance = async (address, blockNumber = null) => {
  let latest =  await blockModule.latestBlockNumber();
  let earliest = await blockModule.earlistContractBlockNumber();
  if(latest<blockNumber || !blockNumber)
    blockNumber = latest;
  blockNumber = blockNumber && blockNumber<earliest ? earliest : blockNumber;
  const tokenBalance = await web3_contract.methods.balanceOf(address).call({}, blockNumber);
  const nbal = Number(utils.exponentTenToDecrease(tokenBalance, constants.DIGITS,constants.DECIMAL));
  return nbal;
}
const getAccounts = async (from, to) => {
  let latest =  await blockModule.latestBlockNumber();
  if(latest < to || !to)
    to = latest;
  let blockNumbers = utils.orderToArray(from, to);
  const accounts = [];
  let promises = [];
  for (const blockNumber of blockNumbers) {
      cb = () => { return new Promise(async (resolve, reject) => {
        let blockData;
        try{
          blockData =  await blockModule.getBlockExt(blockNumber);
          for (const a of blockData.addresses) {
            if(!accounts.includes(a) && a)
              accounts.push(a);
          }
          resolve(blockData);
        }catch(err){
          //throw new Error(err.message);
          console.log("An Error while getting blockData from specific block number.");
          console.dir(err);
          reject(err.message);
        }
      });
    }
    promises.push(cb);
  }
    
  //await Promise.all(promises);
  const chunks = utils.createChunks(promises, constants.CHUNK_SIZE);

  for (const chunk of chunks) {
    let chuck_arr = chunk.map((cb) => cb());
    await Promise.all(chuck_arr);
  }

  return accounts;
}
const getAccountsImpl = async (blockNumbers) => {
  const accounts = [];
  let promises = [];
  for (const blockNumber of blockNumbers) {
      cb = () => { return new Promise(async (resolve, reject) => {
        let blockData;
        try{
          blockData =  await blockModule.getBlockExt(blockNumber);
          for (const a of blockData.addresses) {
            if(!accounts.includes(a) && a)
              accounts.push(a);
          }
          resolve(blockData);
        }catch(err){
          //throw new Error(err.message);
          //reject(err.message);
          console.log("Block Number: ", blockNumber);
          console.log("An Error Occured!");
          console.dir(err);
          //resolve();
        }
      });
    }
    promises.push(cb);
  }
    
  const chunks = utils.createChunks(promises, constants.CHUNK_SIZE);

  for (const chunk of chunks) {
    let chuck_arr = chunk.map((cb) => cb());
    await Promise.all(chuck_arr);
  }

  return accounts;
}


const getBalances = async (from, to, start) => {
  let latest =  await blockModule.latestBlockNumber();
  let earliest = await blockModule.earlistContractBlockNumber();
  from = (!from || from < earliest) ? earliest : (from > latest ? latest : from);
  to = (!to || to < earliest) ? earliest : (to > latest ? latest : to);
  start = (!start || start < earliest) ? earliest : (start > latest ? latest : start);
 
  console.log(from, to, start)

  let accounts = await getAccounts(from, to);
  let bals = [];
  let promises = [];

  for (const account of accounts) {
     cb = () =>{
      return new Promise(async (resolve, reject) => {
      let eth = 0, token = 0;
      //if(!accounts.map(it=>it.address).includes(a) && a)
      main_bal = await getBalance(account, start);
      con_bal = await getWBalance(account, start);
      bals.push({address:account, [constants.MAIN_SYMBOL] : main_bal, [constants.CONTRACT_SYMBOL_1] : con_bal });
      resolve();
      });
    }
    promises.push(cb);
  }

  const chunks = utils.createChunks(promises, constants.CHUNK_SIZE);

  for (const chunk of chunks) {
    let chuck_arr = chunk.map((cb) => cb());
    await Promise.all(chuck_arr);
  }
  return bals;
}

const getBalancesImpl = async (accounts, start) => {

  let bals = [];
  let promises = [];

  for (const account of accounts) {
     cb = () =>{
      return new Promise(async (resolve, reject) => {
      let eth = 0, token = 0;
      //if(!accounts.map(it=>it.address).includes(a) && a)
      main_bal = await getBalance(account, start);
      con_bal = await getWBalance(account, start);
      bals.push({address:account, [constants.MAIN_SYMBOL] : main_bal, [constants.CONTRACT_SYMBOL_1] : con_bal });
      resolve();
      });
    }
    promises.push(cb);
  }

  const chunks = utils.createChunks(promises, constants.CHUNK_SIZE);

  for (const chunk of chunks) {
    let chuck_arr = chunk.map((cb) => cb());
    await Promise.all(chuck_arr);
  }
  return bals;
}
module.exports = {
  getBalance,
  getWBalance,
  getAccounts,
  getAccountsImpl,
  getBalances,
  getBalancesImpl,
}