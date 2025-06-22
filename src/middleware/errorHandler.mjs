export default async (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'Internal Server Error';
	err.success = false;
	res.status(err.statusCode).json({
		success: err.success,
		status: err.status,
		statusCode: err.statusCode,
		message: err.message,
	});

	next();
};
