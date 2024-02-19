import { prisma } from '../../config/index.js';

export class ResumesRepository {

	// 테스트를 위해 의존성 주입
	constructor(prisma){
		this.prisma = prisma;
	}

	findAllResumes = async () => {
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
			// orderBy: {
			// 	[orderKey || 'createdAt']: validOrderValue,
			// },
		};

		const resumes = await this.prisma.resumes.findMany(query);
		return resumes;
	}; // findAllResumes

	createResume = async (userId, title, contents, statusCode) => {
		const createdResume = await this.prisma.resumes.create({
			data: {
				userId,
				title,
				contents,
				...(statusCode && { statusCode }),
			},
		});
	
		return createdResume;
	}; //createResume

	findResumeById = async (resumeId) => {
		const resume = await this.prisma.resumes.findUnique({
			where: { resumeId: +resumeId },
		});

		return resume;
	}; //findResumeById

	updateResume = async (resumeId, title, contents, statusCode) => {
		const updatedResume = await this.prisma.resumes.update({
			where: {
				resumeId: +resumeId,
			},
			data: {
				title,
				contents,
				statusCode,
			},
		});
		return updatedResume;
	}; //updateResume

	deleteResume = async (resumeId) => {
		const deletedResume = await this.prisma.resumes.delete({
			where: { resumeId: +resumeId },
		});
		return deletedResume;
	}; //deleteResume
}
