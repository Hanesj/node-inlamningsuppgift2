import Transaction from '../wallet/Transaction.mjs';

export default class Miner {
	constructor({ transactionPool, wallet, blockchain, networkServer }) {
		this.blockchain = blockchain;
		this.networkServer = networkServer;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		//console.log(wallet);
	}
	mineTransactions() {
		const validateTransactions =
			this.transactionPool.validateTransactions();
		//console.log(validateTransactions);
		// Skapa beloning

		validateTransactions.push(
			Transaction.transactionReward({ miner: this.wallet })
		);

		this.blockchain.addBlock({ data: validateTransactions });
		this.networkServer.broadCastChain();
		this.transactionPool.clearTransactionPool();
	}
}
