const { expectRevert } = require('@openzeppelin/test-helpers');
const Token1 = artifacts.require('EIP20TokenUpgradeable');
const Airdrop1 = artifacts.require('TokenAirdropUpgradeable');
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

contract('TokenAirdropUpgradeable', ([admin, signer, _]) => {
  let token, airdrop;
  const TOTAL_SUPPLY = web3.utils.toWei('1000000');
  const AIRDROP = web3.utils.toWei('100000');
  const MAX_AIRDROP = web3.utils.toWei('10000');

  beforeEach(async () => {
    const instance = await deployProxy(Token1, ["MEME token", "MEME"], {initializer: 'initialize'});
    token = await upgradeProxy(instance.address, Token1);
    await token.mint(admin,  TOTAL_SUPPLY);

    const instance1 = await deployProxy(Airdrop1, [signer, token.address, MAX_AIRDROP]);
    airdrop = await upgradeProxy(instance1.address, Airdrop1);

    await token.transfer(airdrop.address, AIRDROP);
  });

  const createSignature = params => {
    const { address: defaultRecipient } = web3.eth.accounts.create();
    params = {recipient: defaultRecipient, amount: 100, ...params};
    const message = web3.utils.soliditySha3(
      {t: 'address', v: params.recipient},
      {t: 'uint256', v: params.amount}
    ).toString('hex');
    const privKey = '467fd550a1411150501cdb51a94368914a1de312e37274c11bca2e8f59bb4951';
    const { signature } = web3.eth.accounts.sign(
      message, 
      privKey
    );
    return { signature, recipient: params.recipient, amount: params.amount };
  };

  it('Sample message', async() =>{
    const va= {recipient: "0x2449B4D21255d2DE1a234AE7062eA3740b43f913", amount:"1000000000000000000"}
    const message = web3.utils.soliditySha3(
      {t: 'address', v: va.recipient},
      {t: 'uint256', v: va.amount}
    ).toString('hex');

    console.log("message: ", message);

  });
  it('Should airdrop', async () => {
    const { signature, recipient, amount } = createSignature();
    await airdrop.signClaimTokens(recipient, amount, signature);
    const balance = await token.balanceOf(recipient); 
    assert(balance.eq(web3.utils.toBN(amount)));
  });

  it('Should not airdrop twice for same address', async () => {
    const { signature, recipient, amount } = createSignature();
    await airdrop.signClaimTokens(recipient, amount, signature),
    await expectRevert(
      airdrop.signClaimTokens(recipient, amount, signature),
      'airdrop already processed'
    );
  });

  it('Should not airdrop above airdrop limit', async () => {
    const { signature, recipient, amount } = createSignature({
      amount: web3.utils.toWei('100001')
    });
    await expectRevert(
      airdrop.signClaimTokens(recipient, amount, signature),
      'airdropped 100% of the tokens'
    );
  });

  it('Should not airdrop if wrong recipient', async () => {
    const { signature, recipient, amount } = createSignature();
    const { address: wrongRecipient} = web3.eth.accounts.create();
    await expectRevert(
      airdrop.signClaimTokens(wrongRecipient, amount, signature),
      'Wrong signature'
    );
  });

  it('Should not airdrop if wrong amount', async () => {
    const { signature, recipient, amount } = createSignature();
    const wrongAmount = '123';
    await expectRevert(
      airdrop.signClaimTokens(recipient, wrongAmount, signature),
      'Wrong signature'
    );
  });

  it('Should not airdrop if wrong signature', async () => {
    const { signature, recipient, amount } = createSignature();
    const wrongSignature = '0x5ddff27c8b194f7056ad9d051bfca208f430d75d44d21b62e2248ea9de18fa104c43bb0241075a1a771c9003339cf54e2279ee828278c7ad46e5ab834411154a1d'
    await expectRevert(
      airdrop.signClaimTokens(recipient, amount, wrongSignature),
      'Wrong signature'
    );
  });
});