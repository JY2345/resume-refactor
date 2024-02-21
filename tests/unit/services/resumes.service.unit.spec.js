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

describe('Resumes Repository Unit Test', () => {
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

	test('createResume Method', async () => {
		const sampleResume = {
			userId: 1,
			title: '새 이력서 제목',
			contents: '새 이력서 내용',
			createdAt: '2024-02-19T08:38:00Z',
			resumeId: 1,
			updatedAt: '2024-02-19T08:38:00Z',
		};

		const { userId, title, contents, statusCode } = sampleResume;

		mockResumesRepository.createResume.mockReturnValue({
			...sampleResume,
			createdAt: sampleResume.createdAt,
			resumeId: sampleResume.resumeId,
			updatedAt: sampleResume.updatedAt,
		});

		const result = await resumesService.createResume(
			userId,
			title,
			contents,
			statusCode,
		);

		expect(mockResumesRepository.createResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.createResume).toHaveBeenCalledWith(
			userId,
			title,
			contents,
			statusCode,
		);
		expect(result).toEqual(sampleResume);
	});

	test('getResumeById Method', async () => {
		const sampleResume = {
			resumeId: 1,
			userId: 1,
			title: '조회 테스트용 타이틀',
			contents: '조회 테스트용 본문',
			createdAt: new Date('19 Feb 2024 08:38 UTC'),
			updatedAt: new Date('19 Feb 2024 08:38 UTC'),
		};

		mockResumesRepository.findResumeById.mockReturnValue(sampleResume);

		const result = await resumesService.findResumeById(sampleResume.resumeId);

		expect(mockResumesRepository.findResumeById).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.findResumeById).toHaveBeenCalledWith(
			sampleResume.resumeId,
		);
		expect(result).toEqual(sampleResume);
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

		const userId = 1;
		const authCode = 'user';

		mockResumesRepository.findResumeById.mockReturnValue(sampleResume);
		const deleteResume = await resumesService.deleteResume(
			sampleResume.resumeId,
			userId,
			authCode,
		);

		// deleteResume의 비즈니스 로직
		// resumeId로 이력서 찾기 -> 해당 게시글 삭제 -> Method return 값 확인
		expect(mockResumesRepository.deleteResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.deleteResume).toHaveBeenCalledWith(
			sampleResume.resumeId,
		);

		expect(deleteResume).toEqual({
			message: '정상 삭제되었습니다.',
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

	test('updateResume Method', async () => {
		const sampleResume = {
			resumeId: 1,
			userId: 1,
			title: '수정 전 타이틀',
			contents: '수정 전 본문',
			createdAt: new Date('19 Feb 2024 08:38 UTC'),
			updatedAt: new Date('19 Feb 2024 08:38 UTC'),
		};

		const updateData = {
			title: '수정된 타이틀',
			contents: '수정된 본문',
			statusCode: 'APPLY',
		};

		const userId = 1;
		const authCode = 'user';

		mockResumesRepository.findResumeById.mockReturnValue(sampleResume);
		mockResumesRepository.updateResume.mockReturnValue({
			message: '정상 수정되었습니다.',
		});

		const { title, contents, statusCode } = updateData;
		const result = await resumesService.updateResume(
			sampleResume.resumeId,
			userId,
			title,
			contents,
			statusCode,
			authCode,
		);

		expect(mockResumesRepository.updateResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.updateResume).toHaveBeenCalledWith(
			sampleResume.resumeId,
			title,
			contents,
			statusCode,
		);
		expect(result).toEqual({ message: '정상 수정되었습니다.' });
	});
});
