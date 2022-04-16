# Meme Coin
### Airdrop dapp and contracts to airdrop Meme tokens on BSC network to SHIBA holder addresses over ETH network


We would like to build a token on ETH, either from scratch or by “forking” Shiba (this will be decided based on our future specs, below). 
- the coin must also be available on the BSC network; this is necessary for users who do not have the funds to support swap fees on Ethereum. We will airdrop a 8%of our total supply to all shiba holders (this is why we mentioned a fork) 
We mentioned a fork as we are looking to expand during our second phase of development, with a personal dex (a fork of uniswap/sushiswap) on which we can add staking, farming and LPs. 

### Metrics - 600,000,000,000,000 tokens, total supply 
### 33% of tokens (198,000,000,000,000)  

- no vesting, unlocked 
Donated to charity, we will need a function, manually executed, with a single parameter (address) which transfers this percentage of tokens 
---- 

### 33% of tokens (198,000,000,000,000) 

- for aidrops and burn, locked tokens inside a wallet held by the team 
From this percentage of tokens we will give airdrops or burn, which event happens. The events can happen as long as tokens exist. Once this pool has been depleted no further aidrops or burning can happen. 

### 8% of the total supply (48,000,000,000,000) will be airdropped to all Shiba holders as an initial airdrop 

  

### Initial Airdrop Conditions to Shiba Holders 

- this initial airdrop will happen once 
- tokens will be given to Shiba holders on a 1:1 ratio 
- Even if our main contract and Shiba is on ETH, Airdrop tokens will be dropped on BSC, on th ETH address (via metamask). The airdropped tokens will be claimed through a portal. 
- we try to reach as many users as possible 
- we must be able to add certain wallets to exclusion, i.e. we are not giving the tokens to the exchange wallets unless they support us otherwise those tokens are lost 

#### Method 1 of Airdrop
Based on the amount of tokens a user can receive has a cap, a limit based on the amount of Shiba holding, as mentioned we are trying to give out our tokens to as many Shiba holders as possible. Past that limit, the holder will not receive more of our token. Ex: if the limit is 1,000,000,000 (1 billion tokens), if a user has 2 billion Shiba he will still receive 1 billion of our token. The limit we are looking at is 1 billion tokens per user (1,000,000,000) 
- based on the amount received, from 1 token to 1 billion tokens, a user can receive vesting up to 1 year on the tokens received from airdrop 

#### Method 2 of Airdrop
The 8% of total supply equally split between those 900,000 Shiba tokens holders (excluding certain wallet addresses) 
25% of total supply (150,000,000,000,000)- to be burned or airdrop in the future. Which event happens. The events can happen as long as tokens exist. Once this pool has been depleted no further aidrops or burning can happen. 

### Burn rules / Further Airdrop rules 

#### For burn 

- we will burn 1 billion tokens (1,000,000,000) at an execution of a function inside the smart contract. If the amount of tokens available is below 1 billion, it will burn that amount. Further executions upon depletion of this pool of tokens will not produce any result. 

#### For airdrop (it is possible to, again, drop the tokens on BSC) 

- we will airdrop 10 billion tokens (10,000,000,000) to our token holders, based on the amount held, upon an execution of a function inside teh contract. The airdrop will work in the same manner as the "Initial Airdrop", With the only difference being that this airdrop is based on the amount of <OUR TOKEN> held by the users (instead of Shiba held). The amount received will be limited at <a value to be decided> per user, with a vesting based on the amount received, up to <6 months - to be decided> 

 33% of tokens (198,000,000,000,000) - unlocked, we will lock this amount in a liquidity pool, pair with ETH, and give out the LP tokens to some crypto figure 
