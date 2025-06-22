import Block from './Block.mjs';
import { MINE_RATE } from '../../utilitites/config.mjs';
import { GENESIS_BLOCK } from './genesis.mjs';
import { createHash } from '../../utilitites/hash.mjs';
import { expect, it } from 'vitest';
describe('Block', () => {
	const timestamp = 2000;
	const currentHash = 'hash';
	const data = [{ data: 'data', sig: '0x345' }];
	const lastHash = 'lastHash';

	const nonce = 1;
	const difficulty = 1;

	const block = new Block({
		timestamp,
		hash: currentHash,
		data,
		lastHash,
		nonce,
		difficulty,
	});
	describe('should have correct properties', () => {
		it('should have a timestamp property', () => {
			expect(block).toHaveProperty('timestamp');
		});
		it('should have a hash property', () => {
			expect(block).toHaveProperty('hash');
		});
		it('should have property lastHash', () => {
			expect(block).toHaveProperty('lastHash');
		});
		it('should have property data', () => {
			expect(block).toHaveProperty('data');
		});
		it('should have a nonce property', () => {
			expect(block).toHaveProperty('nonce');
		});
		it('should have a difficulty property', () => {
			expect(block).toHaveProperty('difficulty');
		});
	});
	describe('should hace its properties correct initialized', () => {
		it('should set a timestamp value', () => {
			expect(block.timestamp).not.toEqual(undefined);
		});
		it('shoulod have a correct hash', () => {
			expect(block.hash).toEqual(currentHash);
		});
		it('should set the lastHash to the hash of the previous block', () => {
			expect(block.lastHash).toEqual(lastHash);
		});
		it('should set data propert', () => {
			expect(block.data).toEqual(data);
		});
		it('should return an instance of block class', () => {
			expect(block instanceof Block).toBe(true);
		});
	});

	describe('genesis function()', () => {
		const genesisBlock = Block.genesis();
		it('should return instance of block class', () => {
			expect(genesisBlock instanceof Block).toBeTruthy;
		});
		it('should return the genesis data', () => {
			expect(genesisBlock).toEqual(GENESIS_BLOCK);
		});
	});

	describe('mineblock() function', () => {
		const previousBlock = Block.genesis();
		const data = ['avc', 56, 'tre'];
		const minedBlock = Block.mineBlock({ previousBlock, data });
		it('should return instance of block class', () => {
			expect(minedBlock instanceof Block).toBeTruthy();
		});

		it('should set the lastHash to the hash of previous block', () => {
			expect(minedBlock.lastHash).toEqual(previousBlock.hash);
		});
		it('should set the data', () => {
			expect(minedBlock.data).toEqual(data);
		});

		it('should set the timestamp', () => {
			expect(minedBlock.timestamp).not.toEqual(undefined);
		});
		it('should create sha256 on correct input', () => {
			expect(minedBlock.hash).toEqual(
				createHash(
					minedBlock.timestamp,
					previousBlock.hash,
					data,
					minedBlock.nonce,
					minedBlock.difficulty
				)
			);
		});
		// Testa difficulty, antal inledande nollor
		it('should create hash based on difficulty level', () => {
			expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
				'0'.repeat(minedBlock.difficulty)
			);
		});
		it('should adjust the difficulty level', () => {
			const results = [
				previousBlock.difficulty + 1,
				previousBlock.difficulty - 1,
			];

			expect(results.includes(minedBlock.difficulty)).toBe(true);
		});
	});
	describe('adjust difficulty level', () => {
		it('should raise the difficulty level if block is mined quickly', () => {
			expect(
				Block.adjustDifficultyLevel({
					block,
					timestamp: block.timestamp + MINE_RATE - 100,
				})
			).toEqual(block.difficulty + 1);
		});
		it('should lower the difficulty level for slowly mined block', () => {
			expect(
				Block.adjustDifficultyLevel({
					block,
					timestamp: block.timestamp + MINE_RATE + 100,
				})
			).toEqual(block.difficulty - 1);
		});
		it('should have lowest difficulty level of 1', () => {
			block.difficulty = -1;
			expect(Block.adjustDifficultyLevel({ block })).toEqual(1);
		});
	});
});
