import express from 'express';
import { prisma } from '../../config/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import { ResumesController } from '../controllers/resumes.controller.js';
const router = express.Router();
const resumesController = new ResumesController();

/**
 * 이력서 등록
 */
router.post('/resumes', resumesController.createResume);

/**
 * 이력서 전체 조회
 */
router.get('/resumes', resumesController.getResumes);

export default router;
