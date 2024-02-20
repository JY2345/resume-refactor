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
			throw new ApiError(
				404,
				`아이디가 ${resumeId}인 이력서가 존재하지 않습니다.`,
			);
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

	updateResume = async (resumeId, title, contents, statusCode) => {
		const resume = await this.resumesRepository.findResumeById(resumeId);

		if (!resume) throw new ApiError('존재하지 않는 이력서입니다.');

		await this.resumesRepository.updateResume(resumeId, userId, title, content);

		const updatedResume = await this.resumesRepository.findResumeById(resumeId);

		return {
			resumeId: resume.resumeId,
			userId: resume.userId,
			title: resume.title,
			contents: resume.contents,
			createdAt: resume.createdAt,
			updatedAt: resume.updatedAt,
		};
	};

	deleteResume = async (resumeId) => {
		const resume = await this.resumesRepository.findResumeById(resumeId);
		if (!resume) throw new Error('존재하지 않는 이력서입니다.');

		await this.resumesRepository.deleteResume(resumeId);

		return {
			resumeId: resume.resumeId,
			userId: resume.userId,
			title: resume.title,
			contents: resume.contents,
			createdAt: resume.createdAt,
			updatedAt: resume.updatedAt,
		};
	};
}
