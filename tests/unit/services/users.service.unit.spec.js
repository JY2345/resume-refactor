import { expect, jest } from '@jest/globals';
import { UsersService } from '../../../src/services/users.service.js';
import { all } from 'axios';

let mockUsersRepository = {
	findAllUsers: jest.fn(),
	findUserById: jest.fn(),
	createUser: jest.fn(),
	updateUserInfo: jest.fn(),
	deleteUser: jest.fn(),
};

let usersService = new UsersService(mockUsersRepository);

describe('s Repository Unit Test', () => {
	// 테스트 실행시키기 전에 실행...
	beforeEach(() => {
		jest.resetAllMocks(); // Mock 초기화
	});

	// 테스트 시작!
	test('findAlls Method', async () => {
		const sampleUsers = [
			{
				userId: 1,
				userId: 1,
				title: '전체 조회용 제목 테스트',
				contents: '전체 조회용 컨텐츠 테스트',
				statusCode: 'APPLY',
				createdAt: new Date('19 Feb 2024 08:38 UTC'),
				updatedAt: new Date('19 Feb 2024 08:38 UTC'),
			},
			{
				userId: 2,
				userId: 1,
				title: '전체 조회용 제목 테스트2',
				contents: '전체 조회용 컨텐츠 테스트2',
				statusCode: 'APPLY',
				createdAt: new Date('19 Feb 2024 08:38 UTC'),
				updatedAt: new Date('19 Feb 2024 08:38 UTC'),
			},
		];

		mockUsersRepository.findAllUsers.mockReturnValue(sampleUsers);

		const allUsers = await usersService.findAllUsers();

		expect(allUsers).toEqual(
			sampleUsers.sort((a, b) => {
				return b.createdAt - a.createdAt;
			}),
		);

		expect(mockUsersRepository.findAllUsers).toHaveBeenCalledTimes(1);
	});

	test('createUser Method', async () => {
		const sampleUser = {
			userId: 1,
			title: '새 이력서 제목',
			contents: '새 이력서 내용',
			createdAt: '2024-02-19T08:38:00Z',
			userId: 1,
			updatedAt: '2024-02-19T08:38:00Z',
		};

		const { userId, title, contents, statusCode } = sampleUser;

		mockUsersRepository.createUser.mockReturnValue({
			...sampleUser,
			createdAt: sampleUser.createdAt,
			userId: sampleUser.userId,
			updatedAt: sampleUser.updatedAt,
		});

		const result = await usersService.createUser(
			userId,
			title,
			contents,
			statusCode,
		);

		expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
			userId,
			title,
			contents,
			statusCode,
		);
		expect(result).toEqual(sampleUser);
	});

	test('getUserById Method', async () => {
		const sampleUser = {
			userId: 1,
			userId: 1,
			title: '조회 테스트용 타이틀',
			contents: '조회 테스트용 본문',
			createdAt: new Date('19 Feb 2024 08:38 UTC'),
			updatedAt: new Date('19 Feb 2024 08:38 UTC'),
		};

		mockUsersRepository.findUserById.mockReturnValue(sampleUser);

		const result = await usersService.findUserById(sampleUser.userId);

		expect(mockUsersRepository.findUserById).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(
			sampleUser.userId,
		);
		expect(result).toEqual(sampleUser);
	});

	test('deleteUser Method by Success', async () => {
		const sampleUser = {
			userId: 1,
			userId: 1,
			title: '삭제 테스트용 타이틀',
			contents: '삭제 테스트용 본문',
			statusCode: 'APPLY',
			createdAt: new Date('19 Feb 2024 08:38 UTC'),
			updatedAt: new Date('19 Feb 2024 08:38 UTC'),
		};

		const userId = 1;
		const authCode = 'user';

		mockUsersRepository.findUserById.mockReturnValue(sampleUser);
		const deleteUser = await usersService.deleteUser(
			sampleUser.userId,
			userId,
			authCode,
		);

		// deleteUser의 비즈니스 로직
		// userId로 이력서 찾기 -> 해당 게시글 삭제 -> Method return 값 확인
		expect(mockUsersRepository.deleteUser).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.deleteUser).toHaveBeenCalledWith(
			sampleUser.userId,
		);

		expect(deleteUser).toEqual({
			message: '정상 삭제되었습니다.',
		});
	});

	test('deleteUser Method By Not Found User Error', async () => {
		const sampleUser = null;
		mockUsersRepository.findUserById.mockReturnValue(sampleUser);

		try {
			await usersService.deleteUser(8888, 1234);
		} catch (error) {
			expect(mockUsersRepository.findUserById).toHaveBeenCalledTimes(1);
			expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(8888);
			expect(error.message).toEqual('존재하지 않는 유저입니다.');
		}
	});

	test('updateUser Method', async () => {
		const sampleUser = {
			userId: 1,
			userName: '관리자계정',
			email: 'admin@mail.com',
			authCode: 'admin',
			createdAt: new Date('19 Feb 2024 08:38 UTC'),
			updatedAt: new Date('19 Feb 2024 08:38 UTC'),
		};

		const updateData = {
			userId: 1,
			userName: '관리자계정',
			email: 'admin@mail.com',
		};

		mockUsersRepository.findUserById.mockReturnValue(sampleUser);
		mockUsersRepository.updateUserInfo.mockReturnValue({
			message: '정상 수정되었습니다.',
		});

		const { title, contents, statusCode } = updateData;
		const result = await usersService.updateUserInfo(
			updateData.userId,
			updateData.userName,
			updateData.email,
		);

		expect(mockUsersRepository.updateUserInfo).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.updateUserInfo).toHaveBeenCalledWith(
			updateData.userId,
			updateData.userName,
			updateData.email,
		);
		expect(result).toEqual({ message: '정상 수정되었습니다.' });
	});
});
