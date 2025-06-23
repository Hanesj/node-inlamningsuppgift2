import userModel from '../models/schema/userModel.mjs';
import Wallet from '../models/wallet/Wallet.mjs';

export default class UserRepository {
	async add(user) {
		const { firstName, lastName, email, password } = user;
		const wallet = new Wallet();
		return await userModel.create({
			firstName,
			lastName,
			email,
			password,
			publickey: wallet.publicKey,
		});
	}

	async find(email, login) {
		return login === true
			? await userModel.findOne({ email: email }).select('+password')
			: await userModel.findOne({ email: email });
	}
	async findById(id) {
		return await userModel.findById(id);
	}

	async list() {
		return await userModel.find();
	}
}
