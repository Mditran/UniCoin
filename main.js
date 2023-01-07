const BlockChain = require("./BlockChain");
const Block = require("./Block");

const UniCoin = new BlockChain();
UniCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));
UniCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));


console.log('Blockchain valid? ' + UniCoin.isChainValid());

console.log('Changing a block...');
UniCoin.chain[1].data = { amount: 100 };
// UniCoin.chain[1].hash = UniCoin.chain[1].calculateHash();

console.log("Blockchain valid? " + UniCoin.isChainValid());