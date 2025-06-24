import {
	transactionPool,
	wallet,
	networkServer,
	blockChain,
	minerWallet,
} from '../server.mjs';

import Miner from '../models/miner/Miner.mjs';
import Wallet from '../models/wallet/Wallet.mjs';
import { BlockChainRepository } from '../repository/Blockchain-repository.mjs';
import transactionModel from '../models/schema/transactionModel.mjs';

export const addTransaction = async (req, res) => {
	const { amount, recipient } = req.body;
	//const userWallet = new Wallet();
	//userWallet.publicKey = req.user.publickey;
	//console.log(req.user.publickey);
	//req.user.wallet = userWallet;
	let transaction = transactionPool.transactionExists({
		address: wallet.publicKey,
	});
	//console.log(req.user.publickey);
	try {
		if (transaction) {
			transaction.update({ sender: wallet, recipient, amount });
		} else {
			//console.log(userWallet.balance - amount);
			transaction = wallet.createTransaction({
				recipient,
				amount,
				chain: blockChain.chain,
			});
		}
		console.log(req.user.id);
		await transactionModel.create({
			userId: req.user.id,
			transaction: transaction,
		});
		transactionPool.addTransaction(transaction);
		networkServer.broadCastTransaction(transaction);
		res.status(201).json({
			success: true,
			statuscode: 201,
			data: transaction,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			statuscode: 400,
			error: error.message,
		});
	}
};

export const getWalletInfo = (req, res) => {
	const address = wallet.publicKey;
	//const address = req.user.publickey;
	const balance = Wallet.calculateBalance({
		chain: blockChain.chain,
		address,
	});
	res.status(200).json({
		success: true,
		data: { address: address, balance: balance },
	});
};

export const listAllTransactions = (req, res) => {
	res.status(200).json({
		success: true,
		statuscode: 200,
		data: transactionPool.transactionMap,
	});
};

export const mineTransactionPool = async (req, res) => {
	//console.log(req.user);
	const miner = new Miner({
		transactionPool,
		//wallet: req.user.wallet,
		wallet: minerWallet,
		blockchain: blockChain,
		networkServer,
	});

	miner.mineTransactions();
	//const serializedChain = blockChain.chain.map((block) => block.toJSON());
	////console.log(serializedChain);
	////console.log(JSON.stringify({ blockchain: blockChain.chain }, null, 2));

	//await new BlockChainRepository().post({ blockchain: serializedChain });

	const result = await new BlockChainRepository().post({
		blockchain: blockChain.chain,
	});

	//console.log('MongoDB-svar:', result);

	res.status(200).json({
		success: true,
		statuscode: 200,
		data: blockChain.chain,
	});
};
