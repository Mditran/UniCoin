const BlockChain = require("./BlockChain");
const Transaction = require("./Transaction");
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate(
    '7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf'
);
const myWalletAddress = myKey.getPublic('hex');

let UTrueque = new BlockChain();

// Mine first block
UTrueque.minePendingTransactions(myWalletAddress);

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
UTrueque.addTransaction(tx1);

// Mine block
UTrueque.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
UTrueque.addTransaction(tx2);

// Mine block
UTrueque.minePendingTransactions(myWalletAddress);

console.log();
console.log(
    `Balance of xavier is ${UTrueque.getBalanceOfAddress(myWalletAddress)}`
);

// Uncomment this line if you want to test tampering with the chain
// UTrueque.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', UTrueque.isChainValid() ? 'Yes' : 'No');