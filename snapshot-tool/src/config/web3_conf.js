const Web3 = require("web3");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const env = require("./env");

const contractAbi = require("../../abis/shibaAbi.json");
const memeAbi = require("../../abis/memecoin.json");

//const RPC = env.RPC;

const ETHER_MEM = "0x42dbBd5ae373FEA2FC320F62d44C058522Bb3758";
const ETHER_SHIB = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE";

let web3Client;

const getWeb3 = () => {
  if (web3Client) return web3Client;
  const alchemyUrl = env.mainnet_wss_url;
  if(alchemyUrl)
    web3Client = createAlchemyWeb3(alchemyUrl, {maxRetries: 5, retryInterval:1000, retryJitter:1000});
  else {
    let url = env.quickNodeProvider;
    console.log(url);
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
  }
  return web3Client;
};

let web3 = getWeb3();

const getWeb3DefaultBlock = (blockNumber) => {
  if (web3Client) return web3Client;
  web3Client = new Web3(RPC);
  web3Client.eth.defaultBlock = blockNumber;
  return web3Client;
};

const getWeb3Contract = () => {
  return new web3.eth.Contract(contractAbi, ETHER_SHIB);
};

const getWeb3Meme = () => {
  return new web3.eth.Contract(memeAbi, ETHER_MEM);
};

// Wrapper for Web3 callback
const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

module.exports = {
  getWeb3,
  getWeb3DefaultBlock,
  getWeb3Contract,
  getWeb3Meme,
  promisify,
};
