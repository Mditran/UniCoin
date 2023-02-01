const crypto = require('crypto');
class Block {
    /**
   * @param {number} timestamp
   * @param {Transaction[]} transactions
   * @param {string} previousHash
   */
    /* 
    @param index: Posicion del bloque en la cadena
    @param timestamp: Fecha de creacion del bloque
    @param data: Detalles de la transaccion(cantidad, quien es el emisor y receptor)
    @param previousHash: String que contiene el hash anterior al que esta enlazado
    */
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   *
   * @returns {string}
   */
    /* @brief Creacion del hash de un bloque
        @note  JSON.stringify es usado para tranformar un objeto a String */
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
            )
            .digest('hex');
    }
    /**
     * Starts the mining process on the block. It changes the 'nonce' until the hash
     * of the block starts with enough zeros (= difficulty)
     *
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }

    /**
      * Validates all the transactions inside this block (signature + hash) and
      * returns true if everything checks out. False if the block is invalid.
      *
      * @returns {boolean}
      */
    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Block;