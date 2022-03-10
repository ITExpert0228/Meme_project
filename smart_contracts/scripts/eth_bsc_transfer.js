// This can be executed as an external script in truffle env
// $truffle exec scripts/eth_bsc_transfer.js --network eth_testnet

const ETHBridge = artifacts.require('ETHBridge');
const privKey = 'private key of sender - it is test purpose, In fact it should be gotten from contract owner address, because it is impossible to get private keys for every user account';

module.exports = async done => {
  const nonce = 1; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const ethBridge = await ETHBridge.deployed();
  const amount = 1000;
  const message = web3.utils.soliditySha3(
        {t: 'address', v: accounts[0]},
        {t: 'address', v: accounts[0]},
        {t: 'uint256', v: amount},
        {t: 'uint256', v: nonce},
        ).toString('hex');
  const { signature } = web3.eth.accounts.sign(
        message,
        privKey
  );
  await ethBridge.burn(accounts[0], amount, nonce, signature);
  done();
}