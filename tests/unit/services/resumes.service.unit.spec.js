import { expect, jest } from '@jest/globals';
import { ResumesService } from '../../../src/services/resumes.service.js';
import { all } from 'axios';

let mockResumesRepository = {
	findAllResumes: jest.fn(),
	findResumeById: jest.fn(),
	createResume: jest.fn(),
	updateResume: jest.fn(),
	deleteResume: jest.fn(),
};

let resumesService = new ResumesService(mockResumesRepository);

describe('Posts Repository Unit Test', () => {
	// 테스트 실행시키기 전에 실행...
	beforeEach(() => {
		jest.resetAllMocks(); // Mock 초기화
	});

	// 테스트 시작!
	test('findAllResumes Method', async () => {
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

		mockResumesRepository.findAllResumes.mockReturnValue(sampleResumes);

		const allResumes = await resumesService.findAllResumes();

		expect(allResumes).toEqual(
			sampleResumes.sort((a, b) => {
				return b.createdAt - a.createdAt;
			}),
		);

		expect(mockResumesRepository.findAllResumes).toHaveBeenCalledTimes(1);
	});

	test('deleteResume Method by Success', async () => {
		const sampleResume = {
			resumeId: 1,
			userId: 1,
			title: '삭제 테스트용 타이틀',
			contents: '삭제 테스트용 본문',
			statusCode: 'APPLY',
			createdAt: new Date('19 Feb 2024 08:38 UTC'),
			updatedAt: new Date('19 Feb 2024 08:38 UTC'),
		};

		mockResumesRepository.findResumeById.mockReturnValue(sampleResume);
		const deleteResume = await resumesService.deleteResume(1);

		// deleteResume의 비즈니스 로직
		// resumeId로 이력서 찾기 -> 해당 게시글 삭제 -> Method return 값 확인
		expect(mockResumesRepository.deleteResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.deleteResume).toHaveBeenCalledWith(
			sampleResume.resumeId,
		);

		expect(deleteResume).toEqual({
			resumeId: sampleResume.resumeId,
			userId: sampleResume.userId,
			title: sampleResume.title,
			contents: sampleResume.contents,
			createdAt: sampleResume.createdAt,
			updatedAt: sampleResume.updatedAt,
		});
	});

	test('deleteResume Method By Not Found Resume Error', async () => {
		const sampleResume = null;
		mockResumesRepository.findResumeById.mockReturnValue(sampleResume);

		try {
			await resumesService.deleteResume(8888, 1234);
		} catch (error) {
			expect(mockResumesRepository.findResumeById).toHaveBeenCalledTimes(1);
			expect(mockResumesRepository.findResumeById).toHaveBeenCalledWith(8888);
			expect(error.message).toEqual('존재하지 않는 이력서입니다.');
		}
	});
});
