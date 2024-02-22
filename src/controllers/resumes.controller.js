// import { ResumesService } from '../services/resumes.service.js';
import { ApiError } from '../middlewares/error-handling.middleware.js';

export class ResumesController {
	//resumesService = new ResumesService();
	constructor(resumesService) {
		this.resumesService = resumesService;
	}

	/* 조회 */
	getResumes = async (req, res, next) => {
		try {
			const resumes = await this.resumesService.findAllResumes();
			return res.status(200).json({ data: resumes });
		} catch (err){
			next(err);
		}
	};

	/* 이력서 저장 */
	createResume = async (req, res, next) => {
		try {
			const { userId, title, contents, statusCode } = req.body;

			const createdResume = await this.resumesService.createResume(
				userId,
				title,
				contents,
				statusCode,
			);
			return res.status(201).json({ data: createdResume });
		} catch (err) {
			next(err);
		}
	};

	/* 이력서 1건 조회 */
	getResumeById = async (req, res, next) => {
		try {
			const { resumeId } = req.params;
			const resume = await this.resumesService.findResumeById(+resumeId);
			if (!resume) {
				throw new ApiError(
					404,
					`아이디가 ${resumeId}인 이력서가 존재하지 않습니다.`,
				);
			}

			return res.status(200).json({ data: resume });
		} catch (err) {
			if (err instanceof ApiError) {
				res.status(err.status).json({ message: err.message });
			} else {
				res.status(500).json({ message: '서버에서 에러가 발생했습니다.' });
			}
		}
	};

	/* 이력서 업데이트 */
	updateResume = async (req, res, next) => {
		try {
			const { resumeId } = req.params;
			const userId = req.user.userId;
			const authCode = req.user.authCode;
			const { title, contents, statusCode } = req.body;

			const updatedResume = await this.resumesService.updateResume(
				resumeId,
				userId,
				title,
				contents,
				statusCode,
				authCode,
			);

			return res.status(200).json({ data: updatedResume });
		} catch (err) {
			next(err);
		}
	};

	/* 이력서 삭제 */
	deleteResume = async (req, res, next) => {
		try {
			const { resumeId } = req.params;
			const userId = req.user.userId;
			const authCode = req.user.authCode;

			const deletedResume = await this.resumesService.deleteResume(
				resumeId,
				userId,
				authCode,
			);
			return res.status(200).json({ data: deletedResume });
		} catch (err) {
			next(err);
		}
	};
}
