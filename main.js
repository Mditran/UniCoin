const BlockChain = require("./BlockChain");
const Block = require("./Block");

let UniCoin = new BlockChain();
console.log('Mining block 1...');
UniCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));

console.log('Mining block 2...');
UniCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));