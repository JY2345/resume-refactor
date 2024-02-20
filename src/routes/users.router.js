import express from 'express';
import { prisma } from '../../config/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';
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
router.post('/users', usersController.userSignUp);

/**
 * 로그인
 */
//router.post('/resumes', usersController.userSignIn);

/**
 * 회원 목록 조회
 */
router.get('/users', usersController.getUsers);

/**
 * 회원 한 명 정보 조회
 */
router.get('/users/:userId', usersController.getUserById);

/**
 * 회원정보 수정
 */
router.get('/users/:userId', usersController.updateUserInfo);

/**
 * 회원 삭제(탈퇴)
 */
router.delete('/resumes/:resumeId', usersController.userSignOut);

export default router;