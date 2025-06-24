import { beforeEach, expect, it, vi } from 'vitest';
import Wallet from './Wallet.mjs';
import { keyMgr, verifySignature } from '../../utilitites/keyManager.mjs';
import Transaction from './Transaction.mjs';
import Blockchain from '../blockchain/Blockchain.mjs';
import { INITIAL_BALANCE } from '../../utilitites/config.mjs';
describe('Wallet', () => {
	let wallet;

	beforeEach(() => {
		wallet = new Wallet();
	});
	it('should have publicKey prop', () => {
		//console.log(wallet.publicKey);
		expect(wallet).toHaveProperty('publicKey');
	});
	it('should have balance prop', () => {
		expect(wallet).toHaveProperty('balance');
	});
	describe('signing data', () => {
		const data = 'Goodfellas';

		it('should verify a valid signature', () => {
			expect(
				verifySignature({
					publicKey: wallet.publicKey,
					data,
					signature: wallet.sign(data),
				})
			).toBeTruthy();
		});
		it('should not verify an invalid signature', () => {
			expect(
				verifySignature({
					publicKey: wallet.publicKey,
					data,
					signature: new Wallet().sign(data),
				})
			).toBeFalsy();
		});
	});

	describe('balance in wallet', () => {
		describe('balance is lower than the amount is being sent', () => {
			it('should throw error', () => {
				expect(() =>
					wallet.createTransaction({
						amount: 1100,
						recipient: new Wallet(),
					})
				).toThrow('Not enough balance!');
			});
			describe('enough funds to send', () => {
				let trx, amount, recipient;
				beforeEach(() => {
					amount = 25;
					recipient = 'Testarn';
					trx = wallet.createTransaction({ amount, recipient });
					//console.log(trx);
				});
				it('should create transaction object', () => {
					expect(trx).toBeInstanceOf(Transaction);
				});

				it('should match wallet input', () => {
					expect(trx.inputMap.address).toEqual(wallet.publicKey);
				});

				it('should output the amount to recipient', () => {
					expect(trx.outputMap[recipient]).toEqual(amount);
				});
			});
		});
		describe('and a chain is supplied', () => {
			it('should call Wallet.calucalateBalance', () => {
				const calcBalanceMockFn = vi.fn();
				const orgCalcBalance = Wallet.calculateBalance;
				Wallet.calculateBalance = calcBalanceMockFn;

				wallet.createTransaction({
					recipient: 'testarn',
					amount: 40,
					chain: new Blockchain().chain,
				});

				expect(calcBalanceMockFn).toHaveBeenCalled();

				// reset calcbalance func

				Wallet.calculateBalance = orgCalcBalance;
			});
		});
	});
	describe('calculate balance', () => {
		let blockchain;

		beforeEach(() => {
			blockchain = new Blockchain();

			// Nar 0 trx
		});
		describe('and there is no output for wallet', () => {
			it('should return the initial balance const', () => {
				expect(
					Wallet.calculateBalance({
						chain: blockchain.chain,
						address: wallet.publicKey,
					})
				).toEqual(INITIAL_BALANCE);
			});
		});
		describe('and there are transactions for wallet', () => {
			let trx1, trx2;
			beforeEach(() => {
				trx1 = new Wallet().createTransaction({
					recipient: wallet.publicKey,
					amount: 15,
				});
				trx2 = new Wallet().createTransaction({
					recipient: wallet.publicKey,
					amount: 35,
				});

				blockchain.addBlock({ data: [trx1, trx2] });
			});
			it('should calc sum of all transacation in on wallet', () => {
				expect(
					Wallet.calculateBalance({
						chain: blockchain.chain,
						address: wallet.publicKey,
					})
				).toEqual(
					INITIAL_BALANCE +
						trx1.outputMap[wallet.publicKey] +
						trx2.outputMap[wallet.publicKey]
				);
			});

			describe('and the wallet has made trx', () => {
				let recentTrx;

				beforeEach(() => {
					recentTrx = wallet.createTransaction({
						recipient: 'Jooni',
						amount: 40,
					});
					blockchain.addBlock({ data: [recentTrx] });
				});

				it('should return amount from recent trx', () => {
					expect(
						Wallet.calculateBalance({
							chain: blockchain.chain,
							address: wallet.publicKey,
						})
					).toEqual(recentTrx.outputMap[wallet.publicKey]);
				});

				describe('and there are outputs(trx) before and after recent trx', () => {
					let recentBlocktrx, nextBlockTrx;
					beforeEach(() => {
						recentTrx = wallet.createTransaction({
							recipient: 'Kooni',
							amount: 30,
						});

						recentBlocktrx = Transaction.transactionReward({
							miner: wallet,
						});

						blockchain.addBlock({
							data: [recentTrx, recentBlocktrx],
						});

						// Skapa ny trx for ny planbok

						nextBlockTrx = new Wallet().createTransaction({
							recipient: wallet.publicKey,
							amount: 70,
						});
						blockchain.addBlock({ data: [nextBlockTrx] });
					});
					it('should include the amounts from returned balance', () => {
						expect(
							Wallet.calculateBalance({
								chain: blockchain.chain,
								address: wallet.publicKey,
							})
						).toEqual(
							recentBlocktrx.outputMap[wallet.publicKey] +
								recentTrx.outputMap[wallet.publicKey] +
								nextBlockTrx.outputMap[wallet.publicKey]
						);
					});
				});
			});
		});
	});
});
