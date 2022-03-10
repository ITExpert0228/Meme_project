const web3 = require("web3");
const ERC20Token = artifacts.require("ERC20MintToken");
const ETHBridge = artifacts.require('ETHBridge');
const BEP20Token = artifacts.require('BEP20MintToken');
const BSCBridge = artifacts.require('BSCBridge');

module.exports = async (deployer, network, addresses) => {
  let deployAddress = addresses[0];
  let tokenOwner = addresses[0];
  console.log(`Deployer Address: ${deployAddress}`);
  console.log(`Token Owner: ${tokenOwner}`);
  let totalSupply;

  if(!network.includes("main")) {
      totalSupply = web3.utils.toBN('600000000000000000000000000000000').toString();
    } else {
      totalSupply = web3.utils.toBN('600000000000000000000000000000000').toString();
    }


  if(network === 'eth_testnet') {
    
    await deployer.deploy(ERC20Token, {gas: 5000000, from: deployAddress });
    const erc20Token = await ERC20Token.deployed();
    await erc20Token.initialize("Meme Token", "MEMT", 18);
    //await erc20Token.mint(tokenOwner, 1000);

    await deployer.deploy(ETHBridge, erc20Token.address);
    const ethBridge = await ETHBridge.deployed();
    await erc20Token.transferOwnership(ethBridge.address);
  
  }
  if(network === 'bsc_testnet') {
  
    await deployer.deploy(BEP20Token, {gas: 5000000, from: deployAddress });
    const bep20Token = await BEP20Token.deployed();
    await bep20Token.initialize("Meme Token", "MEMT", 18);
    await bep20Token.mint(tokenOwner, totalSupply);

    await deployer.deploy(BSCBridge, bep20Token.address);
    const bscBridge = await BSCBridge.deployed();
    await bep20Token.transferOwnership(bscBridge.address);
  
  }
};
