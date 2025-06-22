import TransactionPool from './TransactionPool.mjs';
import Wallet from './Wallet.mjs';
import Transaction from './Transaction.mjs';
import { expect, it } from 'vitest';
describe('TransactionPool', () => {
	let transactionPool, transaction, sender;

	sender = new Wallet();
	beforeEach(() => {
		transaction = new Transaction({
			sender,
			recipient: 'Testarn',
			amount: 45,
		});
		transactionPool = new TransactionPool();
	});

	describe('validate transactions', () => {
		let transactions = [];
		beforeEach(() => {
			transactions = [];

			for (let i = 0; i < 10; i++) {
				transaction = new Transaction({
					sender,
					recipient: 'Bjurn',
					amount: 32,
				});
				// Skapa felaktiga transaktioner
				if (i % 3 === 0) {
					transaction.inputMap.amount = 1500;
				} else if (i % 3 === 1) {
					transaction.inputMap.signature = new Wallet().sign(
						'Darthan'
					);
				} else {
					transactions.push(transaction);
				}
				transactionPool.addTransaction(transaction);
			}
		});
		it('should only return valid transactions', () => {
			expect(transactionPool.validateTransactions()).toStrictEqual(
				transactions
			);
		});
	});

	describe('clear the transaction pool', () => {
		it('should clear the transaction pool', () => {
			transactionPool.clearTransactionPool();
			expect(transactionPool.transactionMap).toEqual({});
		});
	});
});
