import { jest } from '@jest/globals';
import { ResumesRepository } from '../../../src/repositories/resumes.repository';

let mockPrisma = {
	resumes: {
		findMany: jest.fn(),
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

let resumesRepository = new ResumesRepository(mockPrisma);
describe('Posts Repository Unit Test', () => {
	// 테스트 실행시키기 전에 실행...
	beforeEach(() => {
		jest.resetAllMocks(); // Mock 초기화
	});

	// 테스트 시작!
	test('findAllResumes Method', async () => {
		const mockReturn = 'findMany String';
		mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

		const resumes = await resumesRepository.findAllResumes();

		//한번만 호출
		expect(resumesRepository.prisma.resumes.findMany).toHaveBeenCalledTimes(1);

		expect(resumes).toBe(mockReturn);
	});

	test('createResume Method', async () => {
		const mockReturn = 'create Return String';
		mockPrisma.resumes.create.mockReturnValue(mockReturn);

		const createResumeParams = {
			userId: 1,
			title: '테스트 제목입니다.',
			contents: '테스트용 컨텐츠입니다.',
			statusCode: 'APPLY',
		};

		const createResumeData = await resumesRepository.createResume(
			createResumeParams.userId,
			createResumeParams.title,
			createResumeParams.contents,
			createResumeParams.statusCode,
		);

		expect(createResumeData).toBe(mockReturn);
		expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resumes.create).toHaveBeenCalledWith({
			data: createResumeParams,
		});
	});

	test('findResumeById Method', async () => {
		const mockReturn = 'findResumeById String';
		mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

		const resumes = await resumesRepository.findAllResumes();

		//한번만 호출
		expect(resumesRepository.prisma.resumes.findMany).toHaveBeenCalledTimes(1);

		expect(resumes).toBe(mockReturn);
	});

	test('updateResume Method', async () => {
		console.log('test');
	});

	test('deleteResume Method', async () => {
		console.log('test');
	});
});
