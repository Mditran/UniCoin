const Block = require("./Block");
const Transaction = require("./Transaction");

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /**
  * @returns {Block}
  */
    /* brief se retorna a la cadena el primer bloque
    $note este bloque se debe crear manualmente */
    createGenesisBlock() {
        return new Block(Date.parse('2023-01-09'), [], '0');
    }

    /**
      * Returns the latest block on our chain. Useful when you want to create a
      * new Block and you need the hash of the previous Block.
      *
      * @returns {Block[]}
      */
    /* brief retorna el ultimo bloque de la cadena */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
  * Takes all the pending transactions, puts them in a Block and starts the
  * mining process. It also adds a transaction to send the mining reward to
  * the given address.
  *
  * @param {string} miningRewardAddress
  */

    /**
     *
     * @param {Direccion de la billetera del que va a minar este bloque} miningRewardAddress
     * @note {En la vida real, es imposible meter todas las trnasacciones pendiente en un solo bloque}
     * @note {El minero debera elegir a que transactions quiere ser incluido para minar}
     *
     * @note {Se reiniciara las transacciones pendiente y crear una nueva transaccion para recompensar al minero}
     * Como es un peer-a-peer network y otros nodos en la network no aceptaran intentos de modificaciones de recompensas. Las ignoraran
     */
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(
            null,
            miningRewardAddress,
            this.miningReward
        );
        this.pendingTransactions.push(rewardTx);

        const block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        block.mineBlock(this.difficulty);

        console.log('Block succesfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }
    /**
     * Add a new transaction to the list of pending transactions (to be added
     * next time the mining process starts). This verifies that the given
     * transaction is properly signed.
     *
     * @param {Transaction} transaction
     */
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        // Verify the transactiion
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }
        // Making sure that the amount sent is not greater than existing balance
        const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
        if (walletBalance < transaction.amount) {
            throw new Error('Not enough balance');
        }
        // Get all other pending transactions for the "from" wallet
        const pendingTxForWallet = this.pendingTransactions.filter(
            tx => tx.fromAddress === transaction.fromAddress
        );
        // If the wallet has more pending transactions, calculate the total amount
        // of spend coins so far. If this exceeds the balance, we refuse to add this
        // transaction.
        if (pendingTxForWallet.length > 0) {
            const totalPendingAmount = pendingTxForWallet
                .map(tx => tx.amount)
                .reduce((prev, curr) => prev + curr);

            const totalAmount = totalPendingAmount + transaction.amount;
            if (totalAmount > walletBalance) {
                throw new Error(
                    'Pending transactions for this wallet is higher than its balance.'
                );
            }
        }
        this.pendingTransactions.push(transaction);
        console.log(`Transaction added: ${transaction}`);
    }

    /**
     * Returns the balance of a given wallet address.
     *
     * @param {string} address
     * @returns {number} The balance of the wallet
     */
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress == address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress == address) {
                    balance += trans.amount;
                }
            }
        }
        console.log(`Get balance of address: ${balance}`);
        return balance;
    }

    /**
     * Returns a list of all transactions that happened
     * to and from the given wallet address.
     *
     * @param  {string} address
     * @return {Transaction[]}
     */
    getAllTransactionsForWallet(address) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }

        console.log(`get transactions for wallet count: ${txs.length}`);
        return txs;
    }

    /**
     * Loops over all the blocks in the chain and verify if they are properly
     * linked together and nobody has tampered with the hashes. By checking
     * the blocks it also verifies the (signed) transactions inside of them.
     *
     * @returns {boolean}
     */

    /* @brief  comprobara si la integridad de la cadena
    @return false si la cadena no es validad
    @return true si la cadena es validad */
    isChainValid() {
        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesisBlock with the first block on our chain
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        // Check the remaining blocks on the chain to see if there hashes and
        // signatures are correct
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
        }
        return true;
    }
}

module.exports = BlockChain; 