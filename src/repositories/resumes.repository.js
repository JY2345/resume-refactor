import { prisma } from '../../config/index.js';

export class ResumesRepository {
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

		const resumes = await prisma.resumes.findMany(query);
		return resumes;
	}; // findAllResumes

	createResume = async () => {
		const createdResume = await prisma.resumes.create({
			data: {
				userId,
				title,
				contents,
				...(statusCode && { statusCode }),
			},
		});

		return createdResume;
	}; //createResume

    deleteResume = async (resumeId) => {
        const deletedResume = await prisma.resumes.delete({
			where: { resumeId: +resumeId },
		}); 
        return deletedResume;
    }; //deleteResume
}
