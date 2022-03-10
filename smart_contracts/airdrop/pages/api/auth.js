// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from 'mongoose';
import Web3 from 'web3';
import {getWeb3Contract} from '../../lib/web3_conf';
import utils from '../../lib/utils';
export default async (req, res) => {
  const blockNumber = process.env.NEXT_PUBLIC_SNAPSHOT_BLOCK;
  const airdropPercentage = process.env.NEXT_PUBLIC_AIRDROP_PERCENTAGE;
  const web3_contract = getWeb3Contract();
  const addr = req.body.address;
  const tokenBalance = await web3_contract.methods.balanceOf(addr).call({}, blockNumber);
    //   res
    //   .status(200)
    //   .json({ 
    //     address: addr, 
    //     shibBalance: utils.exponentTenToDecrease(tokenBalance, 18, 8),
    //   });
    // return;
  //2. if record found, return signature
  if(tokenBalance) {
    console.log("tokenBalance", tokenBalance.toString())
    const airdropAmountEther =  Web3.utils.fromWei(tokenBalance) * airdropPercentage / 100;
    console.log("airdropAmountEther", airdropAmountEther.toString())
    const airdropAmountWei =  Web3.utils.toWei(airdropAmountEther.toString()) ;
    const message = Web3.utils.soliditySha3(
      {t: 'address', v: req.body.address},
      {t: 'uint256', v: airdropAmountWei}
    ).toString('hex');
    const web3 = new Web3('');
    const { signature } = web3.eth.accounts.sign(
      message, 
      process.env.PRIVATE_KEY
    );
    res
      .status(200)
      .json({ 
        address: req.body.address, 
        shibBalance: tokenBalance,
        memeAllocation: airdropAmountWei,
        signature
      });
    return;
  }
  //3. otherwise, return error
  res
    .status(401)
    .json({ address: req.body.address });
}
