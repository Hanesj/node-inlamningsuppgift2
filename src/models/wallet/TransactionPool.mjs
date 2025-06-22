import Transaction from './Transaction.mjs';

export default class TransactionPool {
	constructor() {
		this.transactionMap = {};
	}

	addTransaction(transaction) {
		this.transactionMap[transaction.id] = transaction;
	}

	replaceMap(transactionMap) {
		this.transactionMap = transactionMap;
	}

	transactionExists({ address }) {
		const transactions = Object.values(this.transactionMap);
		//console.log(transactions);
		return transactions.find(
			(transaction) => transaction.inputMap.address === address
		);
	}
	validateTransactions() {
		return Object.values(this.transactionMap).filter((trx) =>
			Transaction.validate(trx)
		);
	}
	clearBlockTransactions({ chain }) {
		for (let i = 1; i < chain.length; i++) {
			const block = chain[i];

			for (let trx of block.data) {
				if (this.transactionMap[trx.id]) {
					delete this.transactionMap[trx.id];
				}
			}
		}
	}
	clearTransactionPool() {
		this.transactionMap = {};
	}
}
