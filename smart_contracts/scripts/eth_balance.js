// This can be executed as an external script in truffle env
// $truffle exec scripts/eth_balance.js --network eth_testnet

const ETHToken = artifacts.require('ERC20MintToken');

module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();
  const ethToken = await ETHToken.deployed();
  const balance = await ethToken.balanceOf(sender);
  console.log(balance.toString());
  done();
}