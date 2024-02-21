import { jest } from '@jest/globals';
import { UsersRepository } from '../../../src/repositories/users.repository.js';

let mockPrisma = {
	users: {
		findMany: jest.fn(),
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

let usersRepository = new UsersRepository(mockPrisma);
describe('Users Repository Unit Test', () => {
	// 테스트 실행시키기 전에 실행...
	beforeEach(() => {
		jest.resetAllMocks(); // Mock 초기화
	});

	// 테스트 시작!
	test('findAllUsers Method', async () => {
		const mockReturn = 'findMany String';
		mockPrisma.users.findMany.mockReturnValue(mockReturn);

		const users = await usersRepository.findAllUsers();

		//한번만 호출
		expect(usersRepository.prisma.users.findMany).toHaveBeenCalledTimes(1);

		expect(users).toBe(mockReturn);
	});

	test('createUser Method', async () => {
		const mockReturn = 'create Return String';
		mockPrisma.users.create.mockReturnValue(mockReturn);

		const createUserParams = {
			userName: '관리자계정',
			email: 'admin@mail.com',
			password: '1234',
			authCode: 'admin',
		};

		const createUserData = await usersRepository.createUser(
			createUserParams.userName,
			createUserParams.email,
			createUserParams.password,
			createUserParams.authCode,
		);

		expect(createUserData).toBe(mockReturn);
		expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);
		expect(mockPrisma.users.create).toHaveBeenCalledWith({
			data: createUserParams,
		});
	});

	test('findUserById Method', async () => {
		const mockReturn = 'findUserById String';
		mockPrisma.users.findMany.mockReturnValue(mockReturn);

		const users = await usersRepository.findAllUsers();

		//한번만 호출
		expect(usersRepository.prisma.users.findMany).toHaveBeenCalledTimes(1);

		expect(users).toBe(mockReturn);
	});

	test('updateUserInfo Method', async () => {
		console.log('test');
	});

	test('deleteUser Method', async () => {
		console.log('test');
	});
});
