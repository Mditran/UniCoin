const BlockChain = require("./BlockChain");
const Transaction = require("./Transaction");

let UniCoin = new BlockChain();
UniCoin.createTransaction(new Transaction('address1', 'address2', 100));
UniCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
UniCoin.minePendingTransactions('mditran-address');

console.log('\nBalance of xavier is', UniCoin.getBalanceOfAddress('mditran-address'));

console.log('\n Starting the miner again...');
UniCoin.minePendingTransactions('mditran-address');

console.log('\nBalance of xavier is', UniCoin.getBalanceOfAddress('mditran-address'));