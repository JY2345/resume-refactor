import jwt from 'jsonwebtoken';
import { prisma } from '../../config/index.js';
import { createAccessToken } from '../utils/tokenService.js';

export default async function authenticateToken(req, res, next) {
	const { refreshToken, accessToken } = req.cookies;
	try {
		if (!accessToken) {
			throw new Error('로그인이 필요합니다.');
		}

		const decodedToken = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET_KEY,
		);
		const userId = decodedToken.id;

		const user = await prisma.users.findFirst({
			where: { userId: userId },
		});

		if (!user) {
			res.clearCookie('accessToken');
			throw new Error('토큰 사용자가 존재하지 않습니다.');
		}

		req.user = user;
		next();
	} catch (error) {
		res.clearCookie('accessToken');
		if (error.name === 'TokenExpiredError' && refreshToken) {
			try {
				const decodedRefreshToken = jwt.verify(
					refreshToken,
					process.env.REFRESH_TOKEN_SECRET_KEY,
				);
				const newAccessToken = createAccessToken(decodedRefreshToken.id);

				res.cookie('accessToken', newAccessToken, { httpOnly: true });

				req.user = await prisma.users.findFirst({
					where: { userId: decodedRefreshToken.id },
				});
				return next();
			} catch (refreshTokenError) {
				// 리프레시 토큰 오류 처리
				res.clearCookie('accessToken');
				res.clearCookie('refreshToken');
				return res.status(401).json({ message: '재로그인이 필요합니다.' });
			}
		} else {
			switch (error.name) {
				case 'JsonWebTokenError':
					return res.status(401).json({ message: '토큰이 조작되었습니다.' });
				default:
					return res
						.status(401)
						.json({ message: error.message ?? '비정상적인 요청입니다.' });
			}
		}
	}
}
