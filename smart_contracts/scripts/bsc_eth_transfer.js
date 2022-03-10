const BSCBridge = artifacts.require('BSCBridge');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bscBridge = await BSCBridge.deployed();
  await bscBridge.burn(recipient, 1000);
  done();
}