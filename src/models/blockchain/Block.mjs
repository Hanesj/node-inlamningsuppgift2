import { GENESIS_BLOCK } from './genesis.mjs';
import { createHash } from '../../utilitites/hash.mjs';
import { MINE_RATE } from '../../utilitites/config.mjs';

export default class Block {
	constructor({ timestamp, hash, lastHash, data, nonce, difficulty }) {
		this.nonce = nonce;
		this.difficulty = difficulty;
		this.hash = hash;
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.data = data;
	}
	static genesis() {
		return new this(GENESIS_BLOCK);
	}
	static mineBlock({ previousBlock, data }) {
		let timestamp, hash;
		const lastHash = previousBlock.hash;
		let { difficulty } = previousBlock;
		let nonce = 0;

		// Kor tills antal 0 ar samma som difficulty
		do {
			nonce++;
			timestamp = Date.now();
			difficulty = Block.adjustDifficultyLevel({
				block: previousBlock,
				timestamp,
			});

			hash = createHash(timestamp, lastHash, data, nonce, difficulty);
		} while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

		return new this({ timestamp, lastHash, data, nonce, difficulty, hash });
	}
	static adjustDifficultyLevel({ block, timestamp }) {
		const { difficulty } = block;
		// skydda mot negativ difficultylevel
		if (difficulty < 1) return 1;
		if (timestamp - block.timestamp > MINE_RATE) {
			return difficulty - 1;
		}
		return difficulty + 1;
	}
}
