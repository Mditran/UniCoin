const BlockChain = require("./BlockChain");
const Transaction = require("./Transaction");

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('d41b6d944c98b6bf94527142ffbf2a587769ee99917e984683a019df74e0cf0e');
// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const uniCoin = new BlockChain();
// Mine first block
uniCoin.minePendingTransactions(myWalletAddress);

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
uniCoin.addTransaction(tx1);

// Mine block
console.log("\nStaring the miner....");
uniCoin.minePendingTransactions(myWalletAddress);

console.log(
    "\nBalance of Mike is ",
    uniCoin.getBalanceOfAddress(myWalletAddress)
);
// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
uniCoin.addTransaction(tx2);

// Mine block
uniCoin.minePendingTransactions(myWalletAddress);

console.log();
console.log(
    `Balance of Mike is ${uniCoin.getBalanceOfAddress(myWalletAddress)}`
);

// Uncomment this line if you want to test tampering with the chain
// uniCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', uniCoin.isChainValid() ? 'Yes' : 'No');

//npm install --save crypto-js
//npm install elliptic