
#issue 1:
Source "@openzeppelin/contracts/..." not found: File import callback not supported
#solution 1:
https://github.com/juanfranblanco/vscode-solidity#openzeppelin
- Go to solidity extension (Ethereum Solidity Language for Vistual Studio Code)
- Go to Workspace tab on the setting page.
- Make sure that packageDefaultDependenciesDirectory points to correct path for package defult dependencies directory
If the solidity project is in solution of the workspace.
  "solidity.packageDefaultDependenciesContractsDirectory": "",
  "solidity.packageDefaultDependenciesDirectory": "<solidity_project>/node_modules"

#2 For Opensea ERC1155 project

npm install --save-dev opensea-js //require node 8.11
npm install --save-dev multi-token-standard //ok on current node version 16
(or yarn add multi-token-standard)
npm install --save-dev @0x/subproviders //ok
npm install --save-dev eth-gas-reporter //installation failed
npm install dotenv // useful for .env file and use in js codes. it works only on HTTP.

#3 Install some truffle packages
https://www.npmjs.com/package/truffle-assertions 

npm install --save truffle

// This package adds additional assertions that can be used to test Ethereum smart contracts inside Truffle tests.
npm install truffle-assertions

//This Truffle plugin displays the contract size of all or a selection of your smart contracts in kilobytes
npm install truffle-contract-size

//Truffle Flattener concats solidity files from Truffle and Buidler projects with all of their dependencies.
//This tool helps you to verify contracts developed with Truffle and Buidler on Etherscan, or debugging them on Remix, by merging your files and their dependencies in the right order.
npm install truffle-flattener -g

npm install --save eth-gas-reporter
npm install --save truffle-plugin-verify

npm install --save-dev ethereum-waffle //The most advanced framework for testing smart contracts.

******************************************************
Truffle commands
******************************************************
# Look for Usage, Description, and Options of migrate command
$truffle help migrate 

# without compilation before migrating, run contracts from a specific migration to a specific migration 
# The number refers to the prefix of the migration file.
i.e: $ truffle migrate --f 1 --to 3 --compile-none --network rinkeby
-----
# Look for Usage, Description, and Options of test command
$truffle help test 
i.e: $ truffle test ../test/presale/token.test.js --compile-none



bytes data: 0x00000000000000000000000000000000000000000000000000000000686f6c61

  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

# ContractURI example
    ipfs://bafkreignkbzn4nhtxixs5u7x3zprgzg653kzi3pkljxlyb3bag5e7vhx3u
  /*
            {
            "name": "Famous Art NFT",
            "description": "Famous Art NFT consists of 9000 Arts, each having their own individual traits. No one vampire count is alike. Things have changed since the olden days, The Arts have caught up with the times and now reside in The Lair. The Lair is where all vampires call home - existing in the MetaVerse away from the harmful sunlight and pesky Vampire Hunters alike! All Vampire holders gain access to join their kin in the MetaVerse, while having access to their very own exclusive video game. 8,888 Vampires are now running wild, with their companions and much more coming soon.",
            "image": "ipfs://bafkreigomudyeni42vat3y5coejb5ehu4jf2xm6teqmrcydcujopmlyelm",
            "external_link": "https://svs.gg",
            "seller_fee_basis_points": 250,
            "fee_recipient": "0x1E80FaB8ED55D9dc7be4173A6Af30ae06cec8aE6"
            }
  */

# tokenURI example
    ipfs://bafybeic26wp7ck2bsjhjm5pcdigxqebnthqrmugsygxj5fov2r2qwhxyqu/1
    {
      "name": "Sneaky Vampire #1",
      "description": "[Image without background](https://ipfs.io/ipfs/bafybeibu3edpaeds5w2a23m6cnwlaakvqlvz3ywx4pl2m3i4iigynqdvuy/1_no_bg.png)",
      "attributes": [
        {
          "trait_type": "Accessory",
          "value": "Diamond Stud"
        },
        {
          "trait_type": "Background",
          "value": "Green"
        },
        {
          "trait_type": "Beard",
          "value": "None"
        },
        {
          "trait_type": "Clothes",
          "value": "The Accountant"
        },
        {
          "trait_type": "Eyes",
          "value": "Demonic"
        },
        {
          "trait_type": "Glasses",
          "value": "None"
        },
        {
          "trait_type": "Hair",
          "value": "Blond"
        },
        {
          "trait_type": "Hat",
          "value": "None"
        },
        {
          "trait_type": "Body",
          "value": "Nightcrawler"
        },
        {
          "trait_type": "Head",
          "value": "Nightcrawler"
        },
        {
          "trait_type": "Moon",
          "value": "Sun"
        },
        {
          "trait_type": "Mouth",
          "value": "Pierced Tongue"
        }
      ],
      "image": "ipfs://bafybeibu3edpaeds5w2a23m6cnwlaakvqlvz3ywx4pl2m3i4iigynqdvuy/1.png"
    }