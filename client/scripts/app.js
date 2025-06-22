const form = document.querySelector('#login');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const trxBtn = document.querySelector('#trx');

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

form.addEventListener('submit', handleLogin);
trxBtn.addEventListener('click', getTrx);
document.addEventListener('DOMContentLoaded', initApp);
