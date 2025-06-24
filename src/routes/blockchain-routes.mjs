import express from 'express';
import {
	addBlock,
	listAllBlocks,
} from '../controllers/blockchain-controllers.mjs';
import { protect } from '../controllers/auth-controller.mjs';

export const blockRouter = express.Router();

blockRouter.get('/', listAllBlocks);
//.post('/mine', addBlock);
