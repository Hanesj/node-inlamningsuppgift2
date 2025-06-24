import blockModel from '../schema/blockModel.mjs';
import { createHash } from '../../utilitites/hash.mjs';
import Block from './Block.mjs';

export default class Blockchain {
	constructor() {
		//dbChain.length > 0
		//? (this.chain = dbChain)
		//: (this.chain = [Block.genesis()]);
		this.chain = [Block.genesis()];
	}
	async addBlock({ data }) {
		const addedBlock = Block.mineBlock({
			previousBlock: this.chain[this.chain.length - 1],
			data,
		});
		await blockModel.create({
			timestamp: addedBlock.timestamp,
			data: addedBlock.data,
			hash: addedBlock.hash,
			lastHash: addedBlock.lastHash,
			nonce: addedBlock.nonce,
			difficulty: addedBlock.difficulty,
		});
		this.chain.push(addedBlock);
	}
	static isValid(chain) {
		//console.log(chain);
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
			return false;
		}

		// Testa hele kedjan
		for (let i = 1; i < chain.length; i++) {
			const { timestamp, data, hash, lastHash, nonce, difficulty } =
				chain[i];
			const prevHash = chain[i - 1].hash;

			if (lastHash !== prevHash) return false;

			const validHash = createHash(
				timestamp,
				data,
				lastHash,
				nonce,
				difficulty
			);

			if (hash !== validHash) return false;
		}
		return true;
	}
	// Replacechain tar en lista av block
	replaceChain(chain, callback) {
		if (chain.length <= this.chain.length) return false;
		// Om nya kejdan ar langre och korrekt
		if (!Blockchain.isValid(chain)) {
			return false;
		}
		if (callback) callback();

		this.chain = chain;
	}
}
