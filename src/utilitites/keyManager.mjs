import { createHash } from './hash.mjs';
import EC from 'elliptic';

export const keyMgr = new EC.ec('secp256k1');

export const verifySignature = ({ publicKey, signature, data }) => {
	const key = keyMgr.keyFromPublic(publicKey, 'hex');

	return key.verify(createHash(data), signature);
};
