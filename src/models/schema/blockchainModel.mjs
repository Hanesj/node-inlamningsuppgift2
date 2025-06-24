import mongoose from 'mongoose';

const bcSchema = new mongoose.Schema({
	blockchain: [mongoose.Schema.Types.Mixed],
});

export default mongoose.model('Blockchain', bcSchema);
