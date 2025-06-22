import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
	timestamp: { type: Date },
	data: [mongoose.Schema.Types.Mixed],
	hash: String,
	lastHash: String,
	nonce: Number,
});

const bcSchema = new mongoose.Schema({
	blockchain: [mongoose.Schema.Types.Mixed],
});

export default mongoose.model('Blockchain', bcSchema);
