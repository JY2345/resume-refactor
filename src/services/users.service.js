import { ApiError } from '../middlewares/error-handling.middleware.js';
import { hashPassword } from '../utils/bcrypt.js';

export class UsersService {

	constructor(usersRepository) {
		this.usersRepository = usersRepository;
	}

	/**
	 * 전체 회원 데이터 조회
	 * @returns
	 */
	findAllUsers = async () => {
		const users = await this.usersRepository.findAllUsers();

        if (!users) {
			throw new ApiError(
				404,
				`유저 데이터가 없습니다.`,
			);
		}

		users.sort((a, b) => {
			return b.createdAt - a.createdAt;
		});

		return users.map((user) => {
			return {
				userId: user.userId,
				userName: user.userName,
				email: user.email,
				authCode: user.authCode,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};
		});
	}; // findAllResumes

	/**
	 * 유저 데이터 생성(저장) : 회원가입
	 * @param {*} userName
	 * @param {*} email
	 * @param {*} password
	 * @param {*} authCodes
	 * @returns
	 */
	createUser = async (userName, email, password, authCode) => {


        const existingUser = await this.usersRepository.findUserByEmail(email);
        if (existingUser) {
            throw new ApiError(
                409,
                `이미 등록된 이메일입니다.`
            );
        }

        const hashedPassword = await hashPassword(password);
		const createdUser = await this.usersRepository.
        createUser(
            userName,
            email,
            hashedPassword,
            authCode,
		);

		return {
			userId: createdUser.userId,
			userName: createdUser.userName,
			email: createdUser.email,
			createdAt: createdUser.createdAt,
			updatedAt: createdUser.updatedAt,
		};
	}; // createUser

	/**
	 * 특정 유저 조회
	 * @param {*} resumeId
	 * @returns
	 */
	findUserById = async (userId) => {
		const user = await this.usersRepository.findUserById(userId);

		if (!user) {
			throw new ApiError(
				404,
				`존재하지 않는 유저입니다.`,
			);
		}

		return {
			userId: user.userId,
			userName: user.userName,
			email: user.email,
			authCode : user.authCode,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	};

    /** 
     * 이메일로 조회
     */
    findUserByEmail= async (email) => {
		const user = await this.usersRepository.findUserByEmail(email);

		if (!user) {
			throw new ApiError(
				404,
				`존재하지 않는 유저입니다.`,
			);
		}

		return {
            userId : user.userId,
            email : user.email,
			password : user.password
		};
	};

	updateUserInfo = async (userId, userName, email) => {
		const user = await this.usersRepository.findUserById(userId);

		if (!user) {
			throw new ApiError(
				404,
				`존재하지 않는 유저입니다.`,
			);
		}

		await this.usersRepository.updateUserInfo(userName, email, authCode);

		const updatedUser = await this.usersRepository.findUserById(userId);

		return {
			userId: user.userId,
			userName: user.userName,
			email: user.email,
			authCode : user.authCode,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	};

	deleteUser = async (userId) => {
		const user = await this.usersRepository.findUserById(userId);

		if (!user) {
			throw new ApiError(
				404,
				`존재하지 않는 유저입니다.`,
			);
		}

		await this.usersRepository.deleteUser(userId);

		return {
			userId: user.userId,
			userName: user.userName,
			email: user.email,
			authCode : user.authCode,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	};

    /* 토큰 찾기 */
    findRefreshToken = async (refreshToken) => {
		const existingToken = await this.usersRepository.findRefreshToken(refreshToken);

		if (!existingToken) {
			throw new ApiError(
				401,
				`생성된 토큰 정보를 확인할 수 없습니다.`,
			);
		}
    }

    /* 토큰 데이터 삭제 */
    deleteRefreshToken = async (refreshToken) => {
        const deletedToken = await this.usersRepository.deleteRefreshToken(refreshToken); 
    }
}
