import blockchainModel from '../models/schema/blockchainModel.mjs';

export class BlockChainRepository {
	async get() {
		return await blockchainModel.find();
	}

	async post(data) {
		return await blockchainModel.create(data);
	}
}
