import express from 'express';
import { protect, authorize } from '../controllers/auth-controller.mjs';
import {
	addTransaction,
	listAllTransactions,
	mineTransactionPool,
	getWalletInfo,
} from '../controllers/transaction-controller.mjs';
export const transactionRouter = express.Router();

transactionRouter
	.route('/transactions')
	.get(listAllTransactions)
	.post(protect, authorize('user', 'miner'), addTransaction);

transactionRouter.route('/transactions/mine').get(mineTransactionPool);

transactionRouter.route('/info').get(protect, getWalletInfo);
