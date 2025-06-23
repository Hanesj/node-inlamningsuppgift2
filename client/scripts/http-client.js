export const fetchService = async ({ url, token, bodyData, method }) => {
	const response = await fetch(url, {
		headers: token
			? {
					'Content-Type': 'application/json',
					authorization: `bearer ${token}`,
			  }
			: { 'Content-Type': 'application/json' },
		method: method,
		body: JSON.stringify(bodyData),
	});
};
