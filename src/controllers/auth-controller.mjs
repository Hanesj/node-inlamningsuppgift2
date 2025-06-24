import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { catchErrorAsync } from '../utilitites/catchErrorAsync.mjs';
import AppError from '../models/appError.mjs';
import UserRepository from '../repository/User-repository.mjs';
import Wallet from '../models/wallet/Wallet.mjs';

export const loginUser = catchErrorAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Saknas epost eller losen', 400));
	}

	// Hämta användarens uppgifter...
	const user = await new UserRepository().find(email, true);

	if (!user || !(await user.checkPassword(password, user.password))) {
		return next(new AppError('e-post och eller losen ar fel', 401));
	}

	// Skapa ett jwt token...
	const token = createToken(user._id);

	//res.cookie('jwt');

	res.status(200).json({
		success: true,
		statusCode: 200,
		data: { token: token },
	});
});

export const protect = catchErrorAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.toLowerCase().startsWith('bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new AppError('Unauthorized', 401));
	}

	const decoded = await verifyToken(token);
	const user = await new UserRepository().findById(decoded.id);
	req.user = user;
	//const wallet = new Wallet();
	////console.log(wallet.keyPair);
	//wallet.publicKey = req.user.publickey;
	//req.user.wallet = wallet;
	//console.log(wallet);

	next();
});

export const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('Du har ej tillräcklig behörighet'));
		}
		next();
	};
};
const verifyToken = async (token) => {
	return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

const createToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES,
	});
};
