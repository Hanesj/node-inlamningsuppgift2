import { expect, it } from 'vitest';
import { createHash } from './hash.mjs';
describe('createHash function', () => {
	it('should generate a SHA-256 hash output', () => {
		expect(createHash('test')).toEqual(
			'4d967a30111bf29f0eba01c448b375c1629b2fed01cdfcc3aed91f1b57d5dd5e'
		);
	});

	it('should return same output regardless of order of arguments', () => {
		expect(createHash('Lola', 'Yuni', 'Poli')).toEqual(
			createHash('Poli', 'Lola', 'Yuni')
		);
	});

	it('should create a unique hash when any property has changed', () => {
		const obj = {};
		const orgHash = createHash(obj);
		obj['name'] = 'Everty';
		expect(createHash(obj)).not.toEqual(orgHash);
	});
});
