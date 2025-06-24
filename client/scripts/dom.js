import { MINING_REWARD } from '../../src/utilitites/config.mjs';
export const displayTrx = (transactions) => {
	let html;
	if (Object.keys(transactions).length > 0) {
		const trx = Object.entries(transactions);
		const trxOutputmap = trx.map((t) => t.map((r) => r.outputMap));
		const map = trxOutputmap[0][1];

		let sender = ``;
		html = `<h3>Transaktionspool</h3>
			<i>Mottagare: </i><ul>`;

		for (let key in map) {
			if (key.length > 10) {
				sender = `${key.substring(0, 9)}...: ${map[key]}`;
			} else {
				html += `
					<li>${key}: ${map[key]}</li>
					`;
			}
		}
		html += `</ul><i>Avsändare: <br /> ${sender}</i><br />
			<button class='btn' id='mineBtn'>Mine</button>`;
	} else {
		html = 'Inga transaktioner i pool';
	}

	return html;
};

export const displayBlocks = (allBlocks) => {
	let html = '';
	if (allBlocks.length > 1) {
		allBlocks
			.splice(1)
			.reverse()
			.forEach((block) => {
				//console.log(block);
				const blkHash = block.hash;
				const prevHash = block.lastHash;
				html += `<p>------------------------------------------------------------------------------------------------------</p>
			<h4>Block-hash: ${blkHash}</h4><br />
			<h4>Prev-hash: ${prevHash}</h4><br />
	         <h4>Transaktioner i block:</h4>`;

				block.data.forEach((transaction) => {
					//console.log(transaction.inputMap.address);
					const outputMap = transaction.outputMap;
					let outputs, sender;
					if (transaction.inputMap.address === '#reward-address') {
						outputs = `<i>Mottagare: </i><ul>
					<li>${transaction.inputMap.address}</li>`;
						sender = `Mining-reward: ${MINING_REWARD}`;
					} else {
						sender = '';
						outputs = '<i>Mottagare: </i><ul>';

						for (let key in outputMap) {
							if (key.length > 10) {
								sender = `${key.substring(0, 9)}...: ${
									outputMap[key]
								}`;
							} else {
								outputs += `<li>${key}: ${outputMap[key]}</li>`;
							}
						}
					}
					outputs += '</ul>';

					html += `${outputs}<i>Avsändare: <br /> ${sender}</i><br /><br />`;
				});
			});
	} else {
		html = 'Endast genesis block i kedjan';
	}
	return html;
};
