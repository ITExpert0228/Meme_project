import Web3 from 'web3';
const contractAbi = require("./abis/shibaAbi.json");
const memeAbi = require("./abis/memecoin.json");

//const RPC = env.RPC;

const ETHER_MEM = "0x42dbBd5ae373FEA2FC320F62d44C058522Bb3758";
const ETHER_SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE";

let web3Client;

const getWeb3 = () => {
  if (web3Client) return web3Client;
  let url = process.env.ETH_PROVIDER;
  let options = {
    timeout: 30000,
    clientConfig: {
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 15,
      onTimeout: false,
    },
  };
  web3Client = new Web3(url, options);
  return web3Client;
};

web3Client = getWeb3();

const getWeb3Contract = () => {
  return new web3Client.eth.Contract(contractAbi, ETHER_SHIB);
};

const getWeb3Meme = () => {
  return new web3Client.eth.Contract(memeAbi, ETHER_MEM);
};

module.exports = {
  getWeb3,
  getWeb3Contract,
  getWeb3Meme,
};
