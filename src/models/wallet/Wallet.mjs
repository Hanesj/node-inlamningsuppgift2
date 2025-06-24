import { INITIAL_BALANCE } from '../../utilitites/config.mjs';
import { keyMgr } from '../../utilitites/keyManager.mjs';
import { createHash } from '../../utilitites/hash.mjs';
import Transaction from './Transaction.mjs';
class Wallet {
	constructor() {
		this.balance = INITIAL_BALANCE;
		this.keyPair = keyMgr.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}
	static calculateBalance({ chain, address }) {
		let total = 0;
		let hasMadeNewTrx = false;
		//console.log('???');
		for (let i = chain.length - 1; i > 0; i--) {
			const block = chain[i];

			//console.log('??');
			for (let trx of block.data) {
				if (trx.inputMap.address === address) {
					hasMadeNewTrx = true;
				}
				const amount = trx.outputMap[address];

				if (amount) total += amount;
			}
			if (hasMadeNewTrx) break;
		}
		return hasMadeNewTrx ? total : INITIAL_BALANCE + total;
	}
	sign(data) {
		return this.keyPair.sign(createHash(data));
	}

	createTransaction({ amount, recipient, chain }) {
		if (chain) {
			//console.log(chain);
			this.balance = Wallet.calculateBalance({
				chain,
				address: this.publicKey,
			});
		}
		if (this.balance < amount) {
			throw new Error('Not enough balance!');
		}
		return new Transaction({ sender: this, recipient, amount });
	}
}

export default Wallet;
