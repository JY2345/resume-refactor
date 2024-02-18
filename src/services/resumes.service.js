import { ResumesRepository } from '../repositories/resumes.repository.js';

export class ResumesService {
	resumesRepository = new ResumesRepository();

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
}
