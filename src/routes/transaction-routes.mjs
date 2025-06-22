import express from 'express';
import { protect } from '../controllers/auth-controller.mjs';
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
	.post(protect, addTransaction);

transactionRouter.route('/transactions/mine').get(mineTransactionPool);

transactionRouter.route('/info').get(protect, getWalletInfo);
