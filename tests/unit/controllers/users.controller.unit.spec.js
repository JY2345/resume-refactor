import { beforeEach, jest } from '@jest/globals';
import { UsersController } from '../../../src/controllers/users.controller';
import {mockRequest, mockResponse} from 'jest-mock-express';

const mockUsersService = {
	findAllUsers: jest.fn(),
	findUserById: jest.fn(),
	createUser: jest.fn(),
	updateUser: jest.fn(),
	deleteUser: jest.fn(),
};

const mockNext = jest.fn();
const usersController = new UsersController(mockUsersService);

describe('Users Controller Unit Test', () => {
	let req, res;

	beforeEach(() => {
		jest.clearAllMocks();
		req = mockRequest();
		res = mockResponse();
	});

	test('userSignUp', async () => {
		const userData = {
			userName: 'Test User',
			email: 'test@example.com',
			password: 'password123',
		};
		req.body = userData;

		await usersController.userSignUp(req, res, mockNext);

		expect(mockUsersService.createUser).toHaveBeenCalledWith(
			userData.userName,
			userData.email,
			userData.password,
			expect.anything(),
		);
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test('userSignIn', async () => {
		await usersController.userSignIn(req, res, mockNext);

		expect(mockUsersService.userSignIn).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('userSignOut', async () => {
		await usersController.userSignOut(req, res, mockNext);

		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('getUsers', async () => {
		await usersController.getUsers(req, res, mockNext);

		expect(mockUsersService.findAllUsers).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('getUserById', async () => {
		req.params.userId = '1';

		await usersController.getUserById(req, res, mockNext);

		expect(mockUsersService.findUserById).toHaveBeenCalledWith('1');
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('updateUserInfo', async () => {
		req.params.userId = '1';
		req.body = { userName: 'Updated User' };

		await usersController.updateUserInfo(req, res, mockNext);

		expect(mockUsersService.updateUserInfo).toHaveBeenCalledWith(
			'1',
			req.body.userName,
			expect.anything(),
		);
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('deleteUser', async () => {
		req.params.userId = '1';

		await usersController.deleteUser(req, res, mockNext);

		expect(mockUsersService.deleteUser).toHaveBeenCalledWith('1');
		expect(res.status).toHaveBeenCalledWith(200);
		s;
	});
});
