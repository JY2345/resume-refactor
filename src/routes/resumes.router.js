import express from 'express';
import { prisma } from '../../config/index.js';
import { errorHandler } from '../middlewares/error-handling.middleware.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import { ResumesRepository } from '../repositories/resumes.repository.js';
import { ResumesService } from '../services/resumes.service.js';
import { ResumesController } from '../controllers/resumes.controller.js';
const router = express.Router();

// 의존성 주입
const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);
//const resumesController = new ResumesController();

/**
 * 이력서 등록
 */
router.post('/resumes', authMiddleware, resumesController.createResume);

/**
 * 이력서 전체 조회
 */
router.get('/resumes',authMiddleware, resumesController.getResumes);

/**
 * 이력서 하나 조회
 */
router.get('/resumes/:resumeId', authMiddleware,resumesController.getResumeById);
/**
 * 이력서 수정
 */
router.patch('/resumes/:resumeId', authMiddleware,resumesController.updateResume);

/**
 * 이력서 삭제
 */
router.delete('/resumes/:resumeId', authMiddleware, resumesController.deleteResume);

router.use(errorHandler);

export default router;
