import jwt from 'jsonwebtoken';
import { prisma } from '../../config/index.js';

export async function saveRefreshToken(userId, token) {
	const expiryDate = new Date();

	if (!userId) {
		throw new Error('로그인이 필요합니다.');
	}
	const existingToken = await prisma.refreshTokens.findUnique({
		where: { userId: userId },
	});

	expiryDate.setDate(expiryDate.getDate() + 7);
	try {
		if (existingToken) {
			return await prisma.refreshTokens.update({
				where: { userId: userId },
				data: {
					token: token,
					expiresAt: expiryDate,
				},
			});
		} else {
			return await prisma.refreshTokens.create({
				data: {
					userId: userId,
					token: token,
					expiresAt: expiryDate,
				},
			});
		}
	} catch (error) {
		console.error('리프레시 토큰 저장 중 오류 발생:', error);
		throw error;
	}
}

export function createAccessToken(id) {
	const accessToken = jwt.sign(
		{ id: id },
		process.env.ACCESS_TOKEN_SECRET_KEY,
		{ expiresIn: '12h' },
	);
	return accessToken;
}

export function createRefreshToken(id) {
	const refreshToken = jwt.sign(
		{ id: id },
		process.env.REFRESH_TOKEN_SECRET_KEY,
		{ expiresIn: '7d' },
	);

	return refreshToken;
}
