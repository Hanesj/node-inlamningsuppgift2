import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
	timestamp: { type: Date },
	data: [mongoose.Schema.Types.Mixed],
	hash: String,
	lastHash: String,
	nonce: Number,
	difficulty: Number,
	userId: String,
});

export default mongoose.model('Block', blockSchema);
