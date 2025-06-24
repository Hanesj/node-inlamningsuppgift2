import mongoose from 'mongoose';

const trxSchema = new mongoose.Schema({
	userId: String,
	transaction: mongoose.Schema.Types.Mixed,
});

export default mongoose.model('Transaction', trxSchema);
