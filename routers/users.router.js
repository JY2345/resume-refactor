import express from 'express';
import { prisma } from '../models/index.js';
import { hashPassword, checkPassword } from '../utils/bcrypt.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import { displayUserInfo } from '../utils/kakaoAuth.js';
import {
	createAccessToken,
	createRefreshToken,
	saveRefreshToken,
} from '../utils/tokenService.js';

const router = express.Router();

/**
 * 회원 등록
 */
router.post('/users', async (req, res, next) => {
	const { userName, email, password, authCode } = req.body;

	if (!email) {
		return res.status(409).json({ message: '이메일은 필수값입니다.' });
	}

	const isExistUser = await prisma.users.findFirst({
		where: { email },
	});

	if (isExistUser) {
		return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
	}

	const hashedPassword = await hashPassword(password);

	const user = await prisma.users.create({
		data: {
			userName,
			email,
			password: hashedPassword,
			authCode,
		},
	});

	return res.status(201).json({ message: '회원 정보가 정상 등록되었습니다.' });
});

/**
 * 사용자 정보 조회 (내 정보 조회)
 */
router.get('/users', authMiddleware, async (req, res, next) => {
	const { userId } = req.user;
	const user = await prisma.users.findFirst({
		where: { userId: +userId },
		select: {
			userId: true,
			userName: true,
			email: true,
			authCode: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return res.status(200).json({ data: user });
});

/**
 * 로그인
 */
router.post('/sign-in', async (req, res, next) => {
	const { email, password, kakaoAccessToken } = req.body;
	let isExistUser = null;
	console.log('카카오 토큰 : ' + kakaoAccessToken);
	console.log('카카오 메일 : ' + email);

	// 카카오 로그인 처리
	if (kakaoAccessToken) {
		try {
			// 카카오 사용자 정보 요청
			const kakaoUserInfo = await displayUserInfo(kakaoAccessToken);

			console.log(kakaoUserInfo.email);
			// 카카오 계정으로 사용자 조회
			const user = await prisma.users.findFirst({
				where: {
					email: kakaoUserInfo.email,
				},
			});
			if (!user) {
				return res
					.status(401)
					.json({ message: '존재하지 않는 카카오 계정입니다.' });
			}

			const accessToken = createAccessToken(user.userId);
			const refreshToken = createRefreshToken(user.userId);

			await saveRefreshToken(user.userId, refreshToken);
			res.cookie('accessToken', accessToken, { httpOnly: true });
			res.cookie('refreshToken', refreshToken, { httpOnly: true });

			return res.status(200).json({ message: '로그인 되었습니다.' });
		} catch (error) {
			console.error(error);
			return res.status(500).send('인증 중 오류 발생');
		}
	} else if (email && password) {
		const existUser = await prisma.users.findFirst({
			where: {
				email: email,
			},
		});
		if (!existUser) {
			return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
		}
		if (!(await checkPassword(password, existUser.password))) {
			return res
				.status(401)
				.json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
		}

		const accessToken = createAccessToken(existUser.userId);
		const refreshToken = createRefreshToken(existUser.userId);

		await saveRefreshToken(existUser.userId, refreshToken);

		res.cookie('accessToken', accessToken, { httpOnly: true });
		res.cookie('refreshToken', refreshToken, { httpOnly: true });

		return res.status(200).json({ message: '로그인 되었습니다.' });
	} else {
		return res.status(400).json({ message: '로그인 정보를 제공해주세요.' });
	}
});

/**
 * 로그아웃
 */
router.post('/sign-out', async (req, res, next) => {
	const { refreshToken } = req.cookies;

	if (!refreshToken) {
		return res
			.status(400)
			.json({ message: '로그아웃할 사용자 정보가 없습니다.' });
	}

	try {
		const existingToken = await prisma.refreshTokens.findUnique({
			where: { token: refreshToken },
		});

		if (existingToken) {
			await prisma.refreshTokens.delete({
				where: { token: refreshToken },
			});
		} else {
			return res
				.status(400)
				.json({ message: '로그아웃할 사용자 정보가 없습니다.' });
		}

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

		return res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: '서버 오류가 발생했습니다.', error: error.message });
	}
});

/**
 * 회원 삭제(탈퇴)
 */
router.delete('/users/:userId', authMiddleware, async (req, res, next) => {
	const { userId } = req.params;
	const loginId = req.user.userId;
	const { refreshToken } = req.cookies;

	if (!userId) {
		return res
			.status(400)
			.json({ message: '잘못된 접근입니다. (탈퇴할 아이디 확인 불가)' });
	}
	if (!refreshToken) {
		return res
			.status(400)
			.json({ message: '잘못된 접근입니다. (토큰 확인 불가)' });
	}

	try {
		const existingResume = await prisma.resumes.findFirst({
			where: { userId: +userId },
		});

		const existingUser = await prisma.users.findUnique({
			where: { userId: +userId },
		});

		if (!existingUser) {
			return res
				.status(404)
				.json({ message: '탈퇴할 사용자 조회에 실패하였습니다.' });
		}

		if (loginId != userId && req.user.authCode !== 'admin') {
			return res.status(403).json({ message: '본인만 탈퇴 가능합니다.' });
		}

		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

		await prisma.users.delete({
			where: { userId: +userId },
		});

		return res.status(200).json({ message: '성공적으로 탈퇴되었습니다.' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: '서버 오류가 발생했습니다.', error: error.message });
	}
});

export default router;
