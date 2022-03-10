const BSCToken = artifacts.require('BEP20MintToken');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bscToken = await BSCToken.deployed();
  const balance = await bscToken.balanceOf(recipient);
  console.log(balance.toString());
  done();
}