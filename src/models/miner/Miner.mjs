import Transaction from '../wallet/Transaction.mjs';

export default class Miner {
	constructor({ transactionPool, wallet, blockchain, networkServer }) {
		this.blockchain = blockchain;
		this.networkServer = networkServer;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
	}
	mineTransactions() {
		// Hamta giltiga transaktioner
		const validateTransactions =
			this.transactionPool.validateTransactions();
		// Skapa beloning

		validateTransactions.push(
			Transaction.transactionReward({ miner: this.wallet })
		);
		// skapa block emd alla giltiga transaktioner
		// och placer i kedjan
		this.blockchain.addBlock({ data: validateTransactions });
		this.networkServer.broadCastChain();
		this.transactionPool.clearTransactionPool();
	}
}
