const constants = require("../config/constants");
const cache = require("../libs/cache");
const { getLogger } = require("../libs/logger");
const utils = require("../libs/utils");
const { getAccounts, getBalancesImpl } = require("../modules/account");
const { latestBlockNumber } = require("../modules/block");

const logger = getLogger();

const fetchAccounts = async (startBlock, blockCount = 1) => {
    
    startBlock = Number(startBlock);
    blockCount = Number(blockCount);
    let fetchArray = [];
    const latest = await latestBlockNumber();
    if(!startBlock) {
        startBlock = latest;
        blockCount = 0;    
    } else {
        if(startBlock + blockCount>latest) {
            blockCount = latest - startBlock;
        } else if(startBlock + blockCount <0) {
            blockCount = - startBlock;
        }
    }
    if(startBlock <= constants.LOWER_BLOCKNUMBER) startBlock = constants.LOWER_BLOCKNUMBER;
    
    fetchArray = utils.orderToArray(startBlock, startBlock + blockCount);

    console.log("fetchArray: ", fetchArray);
    let savedBlocks = await cache.getBlockNumbers();
    console.log("savedBlocks: ", savedBlocks);
    let realFetchArray = fetchArray.filter(x => !savedBlocks.includes(x));
    console.log("realFetchArray: ", realFetchArray);
    for(bk of realFetchArray) {
        accounts = [];
        try{
            console.log("- Block Number : %s => ", bk); // OR console.log(`- Block Number : ${bk} => `);
            accounts = await getAccounts(bk, bk);
        } catch(err) {
            console.log(`An error occurred on getAccounts(${bk}): waiting for ${constants.SLEEP_MS} ms` );
            await utils.sleep(constants.SLEEP_MS);
            console.log(`Re-trying....` );
            try {
                accounts = await getAccounts(bk, bk);
            } catch (err) {
                let waiting_more = constants.SLEEP_MS * 3;
                console.log(`Re-trying failed: waiting for ${waiting_more} ms` );
                await utils.sleep(waiting_more);
                console.log(`Moving to next block number...` );
            }
        }
        console.log("   Accounts: ", accounts);
        await cache.saveAccounts(accounts);
        await cache.saveBlockNumber(bk);
    }
}
const fetchBalances = async (startBlock) => {
    accounts = await cache.getAccounts();
    console.log(accounts);
    chunks = utils.createChunks(accounts, 100);
    balances = []
    for (const chunk of chunks) {
        accBalaces = await getBalancesImpl(chunk, startBlock);
        console.log("acc balances => ", accBalaces);
        balances = balances.concat(accBalaces);
        await cache.saveBalances(balances, startBlock);
    }
}

module.exports = {
    fetchAccounts,
    fetchBalances,
};