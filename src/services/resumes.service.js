import { ApiError } from '../middlewares/error-handling.middleware.js';

export class ResumesService {
	constructor(resumesRepository) {
		this.resumesRepository = resumesRepository;
	}

	/**
	 * 전체 이력서 데이터 조회
	 * @returns
	 */
	findAllResumes = async () => {
		const resumes = await this.resumesRepository.findAllResumes();

		if (!resumes) {
			throw new ApiError(404, `이력서 데이터가 없습니다.`);
		}

		resumes.sort((a, b) => {
			return b.createdAt - a.createdAt;
		});

		return resumes.map((resume) => {
			return {
				resumeId: resume.resumeId,
				userId: resume.userId,
				title: resume.title,
				contents: resume.contents,
				statusCode: resume.statusCode,
				createdAt: resume.createdAt,
				updatedAt: resume.updatedAt,
			};
		});
	}; // findAllResumes

	/**
	 * 이력서 데이터 생성(저장)
	 * @param {*} userId
	 * @param {*} title
	 * @param {*} contents
	 * @param {*} statusCode
	 * @returns
	 */
	createResume = async (userId, title, contents, statusCode) => {
		const createdResume = await this.resumesRepository.createResume(
			userId,
			title,
			contents,
			statusCode,
		);

		return {
			resumeId: createdResume.resumeId,
			userId: createdResume.userId,
			title: createdResume.title,
			contents: createdResume.contents,
			createdAt: createdResume.createdAt,
			updatedAt: createdResume.updatedAt,
		};
	}; // createdResume

	/**
	 * 특정 이력서 조회
	 * @param {*} resumeId
	 * @returns
	 */
	findResumeById = async (resumeId) => {
		const resume = await this.resumesRepository.findResumeById(resumeId);

		if (!resume) {
			throw new ApiError(404, `해당 이력서가 없습니다.`);
		}

		return {
			resumeId: resume.resumeId,
			userId: resume.userId,
			title: resume.title,
			contents: resume.contents,
			createdAt: resume.createdAt,
			updatedAt: resume.updatedAt,
		};
	};

	updateResume = async (
		resumeId,
		userId,
		title,
		contents,
		statusCode,
		authCode,
	) => {
		const resume = await this.resumesRepository.findResumeById(resumeId);

		if (!resume) {
			throw new ApiError(404, `해당 이력서가 없습니다.`);
		}

		if (resume.userId != userId && authCode !== 'admin') {
			throw new ApiError(403, `본인의 이력서만 수정 가능합니다.`);
		}

		await this.resumesRepository.updateResume(
			resumeId,
			title,
			contents,
			statusCode,
		);

		return {
			message: '정상 수정되었습니다.',
		};
	};

	deleteResume = async (resumeId, userId, authCode) => {
		const resume = await this.resumesRepository.findResumeById(resumeId);
		if (!resume) {
			throw new ApiError(404, `존재하지 않는 이력서입니다.`);
		}
		if (resume.userId != userId && authCode !== 'admin') {
			throw new ApiError(403, `본인의 이력서만 삭제 가능합니다.`);
		}

		await this.resumesRepository.deleteResume(resumeId);

		return {
			message: '정상 삭제되었습니다.',
		};
	};
}
