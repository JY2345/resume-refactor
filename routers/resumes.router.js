import express from 'express';
import { prisma } from '../config/index.js';
import { hashPassword, checkPassword } from '../utils/bcrypt.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/need-signin.middleware.js';
const router = express.Router();

/**
 * 이력서 등록
 */
router.post('/resumes', authMiddleware, async (req, res, next) => {
	const { userId, title, contents, statusCode } = req.body;

	if (!userId) {
		return res.status(401).json({ message: '회원 정보를 찾을 수 없습니다.' });
	}

	if (!title) {
		return res.status(401).json({ message: '이력서 제목은 필수 요소입니다.' });
	}

	if (!contents) {
		return res
			.status(401)
			.json({ message: '이력서 내용(자기소개)는 필수 요소입니다.' });
	}

	const isExistUser = await prisma.users.findFirst({
		where: { userId },
	});

	if (!isExistUser) {
		return res.status(409).json({ message: '존재하지 않는 회원입니다.' });
	}

	const resume = await prisma.resumes.create({
		data: {
			userId,
			title,
			contents,
			...(statusCode && { statusCode }),
		},
	});

	return res.status(201).json({ message: '이력서가 정상 등록되었습니다.' });
});
/**
 * 이력서 수정
 */
router.patch('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
	const { resumeId } = req.params;
	const { title, contents, statusCode } = req.body;

	const userId = req.user.userId;

	try {
		const existingResume = await prisma.resumes.findUnique({
			where: { resumeId: +resumeId },
		});

		if (!existingResume) {
			return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });
		}

		if (existingResume.userId !== userId && req.user.authCode !== 'admin') {
			return res
				.status(404)
				.json({ message: '본인의 이력서만 수정하실 수 있습니다.' });
		}

		const updatedResume = await prisma.resumes.update({
			where: { resumeId: +resumeId },
			data: {
				...(title && { title }),
				...(contents && { contents }),
				...(statusCode && { statusCode }),
			},
		});

		return res.status(200).json({
			message: '이력서가 정상 수정되었습니다.',
			resume: updatedResume,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: '서버 오류가 발생했습니다.', error: error.message });
	}
});

/**
 * 이력서 삭제
 */
router.delete('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
	const { resumeId } = req.params;
	const userId = req.user.userId;

	try {
		const existingResume = await prisma.resumes.findUnique({
			where: { resumeId: +resumeId },
		});

		if (!existingResume) {
			return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });
		}

		if (existingResume.userId !== userId && req.user.authCode !== 'admin') {
			return res
				.status(403)
				.json({ message: '본인의 이력서만 삭제하실 수 있습니다.' });
		}

		await prisma.resumes.delete({
			where: { resumeId: +resumeId },
		});

		return res
			.status(200)
			.json({ message: '이력서가 성공적으로 삭제되었습니다.' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: '서버 오류가 발생했습니다.', error: error.message });
	}
});

/**
 * 이력서 목록 조회
 */
router.get('/resumes', authMiddleware, async (req, res, next) => {
	const { orderKey, orderValue } = req.query;
	const validOrderValue =
		orderValue && orderValue.toUpperCase() === 'ASC' ? 'asc' : 'desc';

	try {
		let query = {
			select: {
				resumeId: true,
				userId: true,
				title: true,
				contents: true,
				statusCode: true,
				createdAt: true,
				updatedAt: true,
				user: {
					select: {
						userName: true,
					},
				},
			},
			orderBy: {
				[orderKey || 'createdAt']: validOrderValue,
			},
		};

		// 관리자가 아닐 경우 본인 이력서만!!
		if (req.user.authCode !== 'admin') {
			query.where = { userId: req.user.userId };
		}

		const resumes = await prisma.resumes.findMany(query);
		return res.status(200).json({ data: resumes });
	} catch (error) {
		return res
			.status(500)
			.json({ message: '서버 오류가 발생했습니다.', error: error.message });
	}
});

/**
 * 이력서 상세 조회
 */
router.get('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
	const { resumeId } = req.params;
	const resume = await prisma.resumes.findFirst({
		where: {
			resumeId: +resumeId,
		},
		select: {
			resumeId: true,
			userId: true,
			title: true,
			contents: true,
			statusCode: true,
			createdAt: true,
			updatedAt: true,
			user: {
				select: {
					userName: true,
				},
			},
		},
	});

	if (!resume) {
		return res.status(404).json({ message: '존재하지 않는 이력서입니다.' });
	}

	return res.status(200).json({ data: resume });
});

export default router;
