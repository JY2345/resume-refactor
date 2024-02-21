import express from 'express';
import { prisma } from '../../config/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import { errorHandler } from '../middlewares/error-handling.middleware.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { UsersService } from '../services/users.service.js';
import { UsersController } from '../controllers/users.controller.js';
const router = express.Router();

// 의존성 주입
const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

/**
 * 회원가입
 */
router.post('/signup', usersController.userSignUp);

/**
 * 로그인
 */
router.post('/signin', usersController.userSignIn);

/**
 * 로그아웃
 */
router.post('/signout', authMiddleware, usersController.userSignOut);

/**
 * 회원 목록 조회
 */
router.get('/users', authMiddleware, usersController.getUsers);

/**
 * 회원 한 명 정보 조회
 */
router.get('/users/:userId', authMiddleware, usersController.getUserById);

/**
 * 회원정보 수정
 */
router.get('/users/:userId', authMiddleware, usersController.updateUserInfo);

/**
 * 회원 삭제(탈퇴)
 */
router.delete('/users/:userId', authMiddleware, usersController.deleteUser);

router.use(errorHandler);

export default router;
