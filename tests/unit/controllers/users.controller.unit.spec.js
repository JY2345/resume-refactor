import { beforeEach, jest } from '@jest/globals';
import { UsersController } from '../../../src/controllers/users.controller';

const mockUsersService = {
	findAllUsers: jest.fn(),
	findUserById: jest.fn(),
	createUser: jest.fn(),
	updateUser: jest.fn(),
	deleteUser: jest.fn(),
};

const mockRequest = {
	body: jest.fn(),
};

const mockResponse = {
	status: jest.fn(),
	json: jest.fn(),
};

const mockNext = jest.fn();
const usersController = new UsersController(mockUsersService);

describe('Users Controller Unit Test', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		mockResponse.status.mockReturnValue(mockResponse);
	});

	test('getUsers Method by Success', async () => {
		const sampleUsers = [
			{
				userId: 1,
				userName: '관리자계정',
				email: 'admin@mail.com',
				authCode: 'admin',
				createdAt: new Date('19 Feb 2024 08:38 UTC'),
				updatedAt: new Date('19 Feb 2024 08:38 UTC'),
			},
			{
				userId: 2,
				userName: '유저계정',
				email: 'user@mail.com',
				authCode: 'user',
				createdAt: new Date('19 Feb 2024 08:38 UTC'),
				updatedAt: new Date('19 Feb 2024 08:38 UTC'),
			},
		];

		//TODO
	});

	test('createUser Method by Success', async () => {
		const createUserRequestBodyParams = {
			userId: 1,
			userName: '관리자계정',
			email: 'admin@mail.com',
			authCode: 'admin',

			// TODO
		};
	});

	test('createUser Method by Invalid Params Error', async () => {
		mockRequest.body = {
			userId: 0,
			title: 'invalid Params Error',
		};
	});
});
