import { expect, jest } from '@jest/globals';
import { UsersService } from '../../../src/services/users.service.js';
import { hashPassword } from '../../../src/utils/bcrypt.js';

let mockUsersRepository = {
	findAllUsers: jest.fn(),
	findUserById: jest.fn(),
	createUser: jest.fn(),
	updateUserInfo: jest.fn(),
	deleteUser: jest.fn(),
	findUserByEmail : jest.fn(),
};

let usersService = new UsersService(mockUsersRepository);

describe('Users Service Unit Test', () => {
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
			userName: 'JEST',
			email: 'test@test.com',
			password: '1234',
			authCode: 'user',
			createdAt: '2024-02-19T08:38:00Z',
			updatedAt: '2024-02-19T08:38:00Z',
		};

		const { userName, email, password, authCode } = sampleUser;
		const hashedPassword = await hashPassword(password);

		mockUsersRepository.createUser.mockReturnValue({
			...sampleUser
		});

		const result = await usersService.createUser(
			userName,
			email,
			password,
			authCode,
		);
		
		expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
		expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
			userName,
			email,
			hashedPassword,
			authCode,
		);
		expect(result).toEqual(
			{
				userName,
				email,
				hashedPassword,
				authCode,
			}
		);
	});

	test('getUserById Method', async () => {
		const sampleUser = {
			userId: 1,
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
			userId: 1,
			createdAt: sampleUser.createdAt,
			updatedAt: sampleUser.updatedAt
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
		expect(result).toEqual({
			userId: 1,
			userName: '관리자계정',
			email: 'admin@mail.com',
			authCode: 'admin',
			createdAt: new Date('2024-02-19T08:38:00.000Z'),
			updatedAt: new Date('2024-02-19T08:38:00.000Z'),
		});
	});
});
