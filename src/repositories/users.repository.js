import { prisma } from '../../config/index.js';
import { hashPassword } from '../utils/bcrypt.js';

export class UsersRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	findAllUsers = async () => {
		let query = {
			select: {
				userId: true,
				userName: true,
				email: true,
				authCode: true,
				createdAt: true,
				updatedAt: true,
			},
			// orderBy: {
			// 	[orderKey || 'createdAt']: validOrderValue,
			// },
		};

		const users = await this.prisma.users.findMany(query);
		return users;
	}; // findAllUsers

	createUser = async (userName, email, hashedPassword, authCode) => {
		const createdUser = await this.prisma.users.create({
			data: {
				userName,
				email,
				password: hashedPassword,
				authCode,
			},
		});

		return createdUser;
	}; //createUser

	findUserById = async (userId) => {
		const user = await this.prisma.users.findUnique({
			where: { userId: +userId },
		});

		return user;
	}; //findUserById

	findUserByEmail = async (email) => {
		const user = await this.prisma.users.findFirst({
			where: { email: email },
		});

		return user;
	}; //findUserByEmail

	updateUserInfo = async (userId, userName, authCode) => {
		const updatedUser = await this.prisma.users.update({
			where: {
				userId: +userId,
			},
			data: {
				userName,
				authCode,
			},
		});
		return updatedUser;
	}; //updateUserInfo

	deleteUser = async (userId) => {
		const deletedUser = await this.prisma.users.delete({
			where: { userId: +userId },
		});
		return deletedUser;
	}; //deleteUser

	findRefreshToken = async (refreshToken) => {
		const existingToken = await prisma.refreshTokens.findUnique({
			where: { token: refreshToken },
		});
		return existingToken;
	}; //findRefreshToken

	deleteRefreshToken = async (refreshToken) => {
		const deletedToken = await prisma.refreshTokens.delete({
			where: { token: refreshToken },
		});
		return deletedToken;
	}; //deleteRefreshToken
}
