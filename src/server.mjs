import { app } from './app.mjs';
import Blockchain from './models/blockchain/Blockchain.mjs';
import Network from './network.mjs';
import { blockRouter } from './routes/blockchain-routes.mjs';
import { transactionRouter } from './routes/transaction-routes.mjs';
import TransactionPool from './models/wallet/TransactionPool.mjs';
import Wallet from './models/wallet/Wallet.mjs';
import { connectDB } from './db/database.mjs';
import { BlockChainRepository } from './repository/Blockchain-repository.mjs';
import userRouter from './routes/users-routes.mjs';
import authRouter from './routes/auth-routes.mjs';
import errorHandler from './middleware/errorHandler.mjs';

await connectDB();
const chainDB = await new BlockChainRepository().get();

export const blockChain = new Blockchain({ dbChain: chainDB });
export const transactionPool = new TransactionPool();
export const networkServer = new Network({
	blockchain: blockChain,
	transactionPool: transactionPool,
});
export const wallet = new Wallet();

const DEFAULT_PORT = 4000;
let NODE_PORT;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

app.use('/api', blockRouter);
app.use('/api/wallet', transactionRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

const synchronize = async () => {
	let response = await fetch(`${ROOT_NODE}/api`);
	if (response) {
		const result = await response.json();
		console.log('Replacing chain on sync with: ', result.data);
		blockChain.replaceChain(result.data);
	}
	response = await fetch(`${ROOT_NODE}/api/wallet/transactions`);

	if (response) {
		const result = await response.json();
		console.log(
			'Replacing transaction pool map on sync with: ',
			result.data
		);
		transactionPool.replaceMap(result.data);
	}
};

if (process.env.GENERATE_NODE_PORT === 'true') {
	NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
app.use(errorHandler);
const PORT = NODE_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
	console.log(
		`Server
     startad: ${PORT}, mode: ${process.env.NODE_ENV}`
	);
	if (PORT !== DEFAULT_PORT) synchronize();
});
