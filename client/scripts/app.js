const form = document.querySelector('#login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const trxBtn = document.querySelector('#trx');
const blockBtn = document.querySelector('#blocks');
const blkSection = document.querySelector('#blockSection');

let token = undefined;
const URL = 'http://localhost:4000/api';
const initApp = () => {
	if (localStorage.getItem('jwt')) token = localStorage.getItem('jwt');
	console.log(token);
};
const handleLogin = async (e) => {
	e.preventDefault();
	console.log(email.value, password.value);

	const response = await fetch(`${URL}/auth`, {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body: JSON.stringify({
			email: 'test@mail.com',
			password: 'password123',
		}),
	});
	if (response.ok) {
		const result = await response.json();
		console.log(result.data.token);
		localStorage.setItem('jwt', result.data.token);
	}
};

const getTrx = async () => {
	const response = await fetch(`${URL}/wallet/transactions`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			authorization: `bearer ${token}`,
		},
	});
	if (response.ok) {
		const result = await response.json();
		console.log(result);
	}
};
const getBlocks = async () => {
	const response = await fetch(`${URL}/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			authorization: `bearer ${token}`,
		},
	});
	if (response.ok) {
		const result = await response.json();
		//	result.data.forEach((d) => console.log(d.data));
		//console.log(result.data[2].hash);
		//console.log(result.data);
		//blkSection.style.display = 'block';
		//const blkHash = result.data[1].hash;
		//const t = result.data.map((b) => b.data.map((b) => b.outputMap));
		//const r = t[1][0];
		//console.log(t);
		//console.log(r);

		//let html = `<h4>block-hash: ${blkHash}</h4><br />
		//<h4>Transaktioner i block:</h4>
		//<i>Mottagare: </i><ul>`;
		//let sender = ``;

		//for (let key in r) {
		//if (key.length > 10) {
		//sender = `${key.substring(0, 9)}...: ${r[key]}`;
		//} else {
		//html += `<li>${key}: ${r[key]}</li>`;
		//}
		//}
		//html += `</ul><i>Avsändare: <br /> ${sender}</i>`;

		//blkSection.innerHTML = html;

		blkSection.style.display = 'block';

		let html = '';

		result.data.splice(1).forEach((block) => {
			//console.log(block);
			const blkHash = block.hash;
			html += `<p>------------------------------------------------------------------------------------------------------</p>
			<h4>Block-hash: ${blkHash}</h4><br />
	         <h4>Transaktioner i block:</h4>`;

			block.data.forEach((transaction) => {
				//console.log(transaction.inputMap.address);
				const outputMap = transaction.outputMap;
				let outputs, sender;
				if (transaction.inputMap.address === '#reward-address') {
					outputs = `<i>Mottagare: </i><ul>
					<li>${transaction.inputMap.address}</li>`;
					sender = `Mining-reward`;
				} else {
					sender = '';
					outputs = '<i>Mottagare: </i><ul>';

					for (let key in outputMap) {
						if (key.length > 10) {
							// Antagligen en lång public key, tolkas som avsändare
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

		blkSection.innerHTML = html;
	}
};

form.addEventListener('submit', handleLogin);
trxBtn.addEventListener('click', getTrx);
blockBtn.addEventListener('click', getBlocks);
document.addEventListener('DOMContentLoaded', initApp);
