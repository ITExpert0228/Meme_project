const Airdrop = artifacts.require('TokenAirdrop');

module.exports = async (deployer, network, addresses) => {
    let deployAddress = addresses[0];
  await deployer.deploy(Airdrop, {gas: 5000000, from: deployAddress });
  const airdrop = await Airdrop.deployed();
};