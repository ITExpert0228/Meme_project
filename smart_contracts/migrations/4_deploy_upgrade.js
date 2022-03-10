
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades')
const Token1 = artifacts.require('EIP20TokenUpgradeable');
const Airdrop1 = artifacts.require('TokenAirdropUpgradeable');

const TOTAL_SUPPLY = web3.utils.toWei('1000000');
const AIRDROP = web3.utils.toWei('100000');
const MAX_AIRDROP = web3.utils.toWei('10000');

module.exports = async (deployer, network, addresses) => {
    let deployAddress = addresses[0];
    const instance = await deployProxy(Token1, ["MEME token", "MEME"], {deployer, initializer: 'initialize'});
    const token = await upgradeProxy(instance.address, Token1, { deployer });
    await token.mint(deployAddress,  TOTAL_SUPPLY);

    const instance1 = await deployProxy(Airdrop1, [deployAddress, token.address, MAX_AIRDROP], {deployer});
    const airdrop = await upgradeProxy(instance1.address, Airdrop1, { deployer });

    await token.transfer(airdrop.address, AIRDROP);
  };