import { beforeEach, expect, it } from 'vitest';
import { MINING_REWARD, REWARD_ADDRESS } from '../../utilitites/config.mjs';
import Transaction from './Transaction.mjs';
import Wallet from './Wallet.mjs';
import { verifySignature } from '../../utilitites/keyManager.mjs';

describe('transaction', () => {
	let transaction, sender, recipient, amount;

	beforeEach(() => {
		sender = new Wallet();
		recipient = 'Luigi';
		amount = 20;

		transaction = new Transaction({
			sender: sender,
			recipient: recipient,
			amount: amount,
		});
	});
	it('should have property id', () => {
		expect(transaction).toHaveProperty('id');
	});
	describe('outputMap', () => {
		it('should have property outputMap', () => {
			//console.log(transaction.id);
			//console.log(transaction.outputMap);
			//console.log(transaction.inputMap);
			expect(transaction).toHaveProperty('outputMap');
		});
		it('should display the amount to the recipient', () => {
			expect(transaction.outputMap[recipient]).toEqual(amount);
		});
		it('should display the balance for the senders wallet', () => {
			expect(transaction.outputMap[sender.publicKey]).toEqual(
				sender.balance - amount
			);
		});
	});
	describe('inputMap', () => {
		it('should have property inputMap', () => {
			expect(transaction).toHaveProperty('inputMap');
		});

		it('should have amount property', () => {
			expect(transaction.inputMap).toHaveProperty('amount');
		});

		it('should have address property', () => {
			expect(transaction.inputMap).toHaveProperty('address');
		});

		it('should have signature property', () => {
			expect(transaction.inputMap).toHaveProperty('signature');
		});

		it('should have timestamp property', () => {
			expect(transaction.inputMap).toHaveProperty('timestamp');
		});
		it('should set the amount to the sendersbalance', () => {
			expect(transaction.inputMap.amount).toEqual(sender.balance);
		});

		it('should set the address to the senders pubkey', () => {
			expect(transaction.inputMap.address).toEqual(sender.publicKey);
		});

		it('should sign the input', () => {
			//console.log(transaction.inputMap.signature);
			expect(
				verifySignature({
					publicKey: sender.publicKey,
					data: transaction.outputMap,
					signature: transaction.inputMap.signature,
				})
			).toBeTruthy();
		});
	});
	describe('validation', () => {
		describe('when transaction is valid', () => {
			it('should return true', () => {
				expect(Transaction.validate(transaction)).toBeTruthy();
			});
		});
		describe('when transaction is invalid', () => {
			describe('and transaction outputmap is invalid', () => {
				it('should return false', () => {
					transaction.outputMap[sender.publicKey] = 123321;
					expect(Transaction.validate(transaction)).toBeFalsy();
				});
			});
		});
		describe('and transaction input signature is invalid', () => {
			it('should return false', () => {
				transaction.inputMap.signature = new Wallet().sign(
					'Can i change signature?'
				);
				expect(Transaction.validate(transaction)).toBeFalsy();
			});
		});
	});

	describe('update transaction', () => {
		let orgSignature, orgSenderOutMap, nextRecipient, nextAmount;

		describe('and the amount is invalid (funds too low)', () => {
			it('should throw an error', () => {
				expect(() => {
					transaction.update({ sender, recipient, amount: 1100 });
				}).toThrow('Not enough balance!');
			});
		});
		describe('and the amount is valid', () => {
			beforeEach(() => {
				orgSignature = transaction.inputMap.signature;
				orgSenderOutMap = transaction.outputMap[sender.publicKey];
				nextAmount = 25;
				nextRecipient = 'Loki';

				transaction.update({
					sender,
					recipient: nextRecipient,
					amount: nextAmount,
				});
			});
			it('should display the amount to the next recipient', () => {
				expect(transaction.outputMap[nextRecipient]).toEqual(
					nextAmount
				);
			});
			it('should decrease the senders balance', () => {
				expect(transaction.outputMap[sender.publicKey]).toEqual(
					orgSenderOutMap - nextAmount
				);
			});
			it('should match the total balance with input amount', () => {
				expect(
					Object.values(transaction.outputMap).reduce(
						(sum, amount) => sum + amount
					)
				).toEqual(transaction.inputMap.amount);
			});
			it('should create a new signature', () => {
				expect(transaction.inputMap.signature).not.toEqual(
					orgSignature
				);
			});

			describe('and an update for the same recipient', () => {
				let newAmount;
				beforeEach(() => {
					newAmount = 32;
					transaction.update({
						sender,
						recipient: nextRecipient,
						amount: newAmount,
					});
				});
				it('should update the recipients amount', () => {
					expect(transaction.outputMap[nextRecipient]).toEqual(
						nextAmount + newAmount
					);
				});

				it('should withdraw balance from the sender', () => {
					expect(transaction.outputMap[sender.publicKey]).toEqual(
						orgSenderOutMap - nextAmount - newAmount
					);
				});
			});
		});
	});

	describe('transaction reward', () => {
		let transactionReward, miner;
		beforeEach(() => {
			miner = new Wallet();

			transactionReward = Transaction.transactionReward({ miner });
		});
		it('should create a reward transaction', () => {
			expect(transactionReward.inputMap).toEqual(REWARD_ADDRESS);
		});
		it('should create only one transaction with the MINING_REWARD', () => {
			expect(transactionReward.outputMap[miner.publicKey]).toEqual(
				MINING_REWARD
			);
		});
	});
});
