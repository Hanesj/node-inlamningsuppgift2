import { blockChain, networkServer } from '../server.mjs';

export const listAllBlocks = (req, res) => {
	res.status(200).json({
		success: true,
		data: blockChain.chain,
	});
};

export const addBlock = (req, res) => {
	//console.log(req.body);
	const { data } = req.body;
	blockChain.addBlock({ data });

	networkServer.broadCastChain();

	res.status(201).json({
		success: true,
		message: 'Block added',
		data: blockChain.chain,
	});
};
