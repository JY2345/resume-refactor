import { ResumesService } from '../services/resumes.service.js';

export class ResumesController {
	resumesService = new ResumesService();

	/* 조회 */
	getResumes = async (req, res, next) => {
		try {
			const resumes = await this.resumesService.findAllResumes();
			return res.status(200).json({ data: resumes });
		} catch {
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
				...(statusCode && { statusCode }),
			);
			return res.status(201).json({ data: createdResume });
		} catch (err) {
			next(err);
		}
	};
}
