import mongoose from 'mongoose';
export const connectDB = async () => {
	try {
		console.log(process.env.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI);
		if (conn) {
			console.log(`Databas igang: ${conn.connection.host}`);
		}
	} catch (error) {
		console.log(error);
	}
};
