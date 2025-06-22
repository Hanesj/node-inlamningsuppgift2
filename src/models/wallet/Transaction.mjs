import { v4 as uuid } from 'uuid';
import { verifySignature } from '../../utilitites/keyManager.mjs';
import { MINING_REWARD, REWARD_ADDRESS } from '../../utilitites/config.mjs';

export default class Transaction {
	constructor({ sender, recipient, amount, inputMap, outputMap }) {
		//	this.transaction = { sender, recipient, amount };

		this.id = uuid().replaceAll('-', '');

		this.outputMap =
			outputMap || this.createOutputMap({ sender, recipient, amount });
		this.inputMap =
			inputMap ||
			this.createInputMap({
				sender,
				outputMap: this.outputMap,
			});
		//this.outputMap = {
		//sender: sender.publicKey,
		//recipient: recipient,
		//senderBalance: sender.balance - amount,
		//};
		//this.inputMap = {
		//recipient,
		//sender: sender.publicKey,
		//amount: `+${amount}`,
		//};
	}
	static validate(transaction) {
		const {
			outputMap,
			inputMap: { address, amount, signature },
		} = transaction;

		const total = Object.values(outputMap).reduce(
			(sum, amount) => (sum += amount)
		);

		if (amount !== total) return false;
		if (
			!verifySignature({ publicKey: address, signature, data: outputMap })
		)
			return false;
		return true;
	}
	static transactionReward({ miner }) {
		return new this({
			inputMap: REWARD_ADDRESS,
			outputMap: { [miner.publicKey]: MINING_REWARD },
		});
	}
	update({ sender, recipient, amount }) {
		// kontroll for avsandares balans
		if (this.outputMap[sender.publicKey] < amount) {
			throw new Error('Not enough balance!');
		}
		// ny mottagare eller ska det laggas till en ny

		if (!this.outputMap[recipient]) {
			this.outputMap[recipient] = amount;
		} else {
			this.outputMap[recipient] += amount;
		}

		this.outputMap[sender.publicKey] -= amount;

		this.inputMap = this.createInputMap({
			sender,
			outputMap: this.outputMap,
		});
	}
	createOutputMap({ sender, recipient, amount }) {
		const map = {};

		map[recipient] = amount;
		map[sender.publicKey] = sender.balance - amount;
		//console.log('MAP', map);
		return map;
	}
	createInputMap({ sender, outputMap }) {
		return {
			timestamp: Date.now(),
			amount: sender.balance,
			address: sender.publicKey,
			signature: sender.sign(outputMap),
		};
	}
}
