import { beforeEach, jest } from '@jest/globals';
import { ResumesController } from '../../../src/controllers/resumes.controller';

const mockResumesService = {
	findAllResumes: jest.fn(),
	findResumeById: jest.fn(),
	createResume: jest.fn(),
	updateResume: jest.fn(),
	deleteResume: jest.fn(),
};

const mockRequest = {
	body: jest.fn(),
};

const mockResponse = {
	status: jest.fn(),
	json: jest.fn(),
};

const mockNext = jest.fn();
const resumesController = new ResumesController(mockResumesService);

describe('Resumes Controller Unit Test', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockResponse.status.mockReturnValue(mockResponse);
	});

	test('getResumes Method by Success', async () => {
		const sampleResumes = [
			{
				resumeId: 1,
				userId: 1,
				title: '전체 조회용 제목 테스트',
				contents: '전체 조회용 컨텐츠 테스트',
				statusCode: 'APPLY',
				createdAt: new Date('19 Feb 2024 08:38 UTC'),
				updatedAt: new Date('19 Feb 2024 08:38 UTC'),
			},
			{
				resumeId: 2,
				userId: 1,
				title: '전체 조회용 제목 테스트2',
				contents: '전체 조회용 컨텐츠 테스트2',
				statusCode: 'APPLY',
				createdAt: new Date('19 Feb 2024 08:38 UTC'),
				updatedAt: new Date('19 Feb 2024 08:38 UTC'),
			},
		];

		//TODO
	});

	test('createResume Method by Success', async () => {
		const createResumeRequestBodyParams = {
			userId: 1,
			title: '이력서 생성 컨트롤러 테스트 : 타이틀',
			contents: '이력서 생성 컨트롤러 테스트 : 본문',
			statusCode: 'APPLY',

			// TODO
		};
	});

	test('createResume Method by Invalid Params Error', async () => {
		mockRequest.body = {
			userId: 0,
			title: 'invalid Params Error',
		};
	});
});
