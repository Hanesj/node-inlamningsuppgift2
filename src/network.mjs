import redis from 'redis';

const CHANNELS = {
	TEST: 'TEST',
	BLOCKCHAIN: 'BLOCKCHAIN',
	TRANSACTION: 'TRANSACTION',
};
export default class Network {
	constructor({ blockchain, transactionPool }) {
		this.transactionPool = transactionPool;
		this.blockchain = blockchain;
		this.subscriber = redis.createClient();
		this.publisher = redis.createClient();

		//		this.subscriber.subscribe(CHANNELS.TEST);

		// Loadchannels
		this.loadChannels();

		this.subscriber.on('message', (channel, message) => {
			this.handleMessage(channel, message);
		});
	}
	broadCastChain() {
		this.publish({
			channel: CHANNELS.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain),
		});
	}
	broadCastTransaction(transaction) {
		this.publish({
			channel: CHANNELS.TRANSACTION,
			message: JSON.stringify(transaction),
		});
	}

	handleMessage(channel, message) {
		console.log(`Got message ${message} from ${channel}`);
		const msg = JSON.parse(message);

		switch (channel) {
			case CHANNELS.BLOCKCHAIN:
				this.blockchain.replaceChain(msg, () => {
					this.transactionPool.clearBlockTransactions({
						chain: msg,
					});
				});
				break;

			case CHANNELS.TRANSACTION:
				this.transactionPool.addTransaction(msg);
				break;

			default:
				return;
		}
	}

	publish({ channel, message }) {
		this.subscriber.unsubscribe(channel, () => {
			this.publisher.publish(channel, message, () => {
				this.subscriber.subscribe(channel);
			});
		});
	}

	loadChannels() {
		Object.values(CHANNELS).forEach((channel) => {
			this.subscriber.subscribe(channel);
		});
	}
}
