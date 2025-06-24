import { displayBlocks, displayTrx } from './dom.js';
const form = document.querySelector('#login');
const regForm = document.querySelector('#regForm');

const logoutBtn = document.querySelector('#logout');

const trxBtn = document.querySelector('#trx');
const blockBtn = document.querySelector('#blocks');
const blkSection = document.querySelector('#blockSection');

const trxSection = document.querySelector('#trxSection');

const trxForm = document.querySelector('#trxForm');

let token = undefined;
let mineBtn = undefined;
const URL = 'http://localhost:4000/api';
const initApp = () => {
	if (localStorage.getItem('jwt')) {
		token = localStorage.getItem('jwt');
		form.style.display = 'none';
		logoutBtn.style.display = 'block';
		regForm.style.display = 'none';
	}
};
const handleLogin = async (e) => {
	e.preventDefault();
	//console.log(email.value, password.value);
	const formData = new FormData(form);
	const formObj = Object.fromEntries(formData);
	try {
		const response = await fetch(`${URL}/auth`, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify(formObj),
		});
		if (response.ok) {
			const result = await response.json();
			localStorage.setItem('jwt', result.data.token);
			form.style.display = 'none';
			logoutBtn.style.display = 'block';
			window.location.reload();
		} else {
			alert('Fel lösen/email');
		}
	} catch (error) {
		console.log(error);
	}
	form.reset();
};

const handleRegister = async (e) => {
	e.preventDefault();
	const formData = new FormData(regForm);
	const formObj = Object.fromEntries(formData);
	console.log(formObj);
	try {
		const response = await fetch(`${URL}/users`, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify(formObj),
		});
		if (response.ok) {
			alert('Konto skapat');
			regForm.style.display = 'none';
			regForm.reset();
		}
	} catch (error) {}
};

const handleLogout = async () => {
	localStorage.removeItem('jwt');

	form.style.display = 'flex';
	logoutBtn.style.display = 'none';

	window.location.reload();
};

const getTrx = async () => {
	try {
		const response = await fetch(`${URL}/wallet/transactions`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				authorization: `bearer ${token}`,
			},
		});
		if (response.ok) {
			const result = await response.json();
			trxSection.style.display = 'block';
			let html = displayTrx(result.data);
			trxSection.innerHTML = html;
			if (document.querySelector('#mineBtn'))
				mineBtn = document
					.querySelector('#mineBtn')
					.addEventListener('click', mineBlock);
		} else {
			alert('Måste logga in');
		}
	} catch (error) {
		console.log(error);
	}
};

const mineBlock = async () => {
	try {
		const response = await fetch(`${URL}/wallet/transactions/mine`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				authorization: `bearer ${token}`,
			},
		});
		if (response.ok) {
			//const result = await response.json();
			await getBlocks();
			await getTrx();
		}
	} catch (error) {
		console.log(error);
	}
};

const getBlocks = async () => {
	try {
		const response = await fetch(`${URL}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				authorization: `bearer ${token}`,
			},
		});
		if (response.ok) {
			const result = await response.json();

			blkSection.style.display = 'block';

			let html = displayBlocks(result.data);

			blkSection.innerHTML = html;
		} else {
			alert('Måste logga in');
		}
	} catch (error) {
		console.log(error);
	}
};

const sendTrx = async (e) => {
	e.preventDefault();
	const formData = new FormData(trxForm);
	const formObj = Object.fromEntries(formData);
	formObj.amount = parseInt(formObj.amount);
	try {
		const response = await fetch(`${URL}/wallet/transactions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `bearer ${token}`,
			},
			body: JSON.stringify(formObj),
		});
		if (response.ok) {
			//const result = await response.json();
			trxForm.reset();
			await getTrx();
		} else {
			alert('For lågt saldo..');
			trxForm.reset();
		}
	} catch (error) {
		console.log(error);
	}
};

regForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);
trxForm.addEventListener('submit', sendTrx);
form.addEventListener('submit', handleLogin);
trxBtn.addEventListener('click', getTrx);
blockBtn.addEventListener('click', getBlocks);
document.addEventListener('DOMContentLoaded', initApp);
