import { checkPassword } from '../utils/bcrypt.js';
import {
	createAccessToken,
	createRefreshToken,
	saveRefreshToken,
} from '../utils/tokenService.js';
import { ApiError } from '../middlewares/error-handling.middleware.js';

export class UsersController {
	constructor(usersService) {
		this.usersService = usersService;
	}

	/* 조회 */
	getUsers = async (req, res, next) => {
		try {
			const users = await this.usersService.findAllUsers();
			return res.status(200).json({ data: users });
		} catch {
			next(err);
		}
	};

	/* 회원가입 */
	userSignUp = async (req, res, next) => {
		try {
			const { userName, email, password, authCode } = req.body;

			let missingFields = [];
			if (!userName) missingFields.push('회원명은');
			if (!email) missingFields.push('이메일은');
			if (!password) missingFields.push('패스워드는');
			if (!authCode) missingFields.push('권한구분은');
			if (missingFields.length > 0) {
				throw new ApiError(400, `${missingFields.join(', ')} 필수값입니다.`);
			}

			const createdUser = await this.usersService.createUser(
				userName,
				email,
				password,
				authCode,
			);
			return res.status(201).json({ data: createdUser });
		} catch (err) {
			next(err);
		}
	};

	/* 로그인 */
	userSignIn = async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await this.usersService.findUserByEmail(email);

			const isPasswordMatch = await checkPassword(password, user.password);

			if (!isPasswordMatch) {
				throw new ApiError(401, '아이디 혹은 비밀번호가 일치하지 않습니다.');
			}

			const accessToken = createAccessToken(user.userId);
			const refreshToken = createRefreshToken(user.userId);

			await saveRefreshToken(user.userId, refreshToken);
			res.cookie('accessToken', accessToken, { httpOnly: true });
			res.cookie('refreshToken', refreshToken, { httpOnly: true });

			return res.status(200).json({ message: '로그인 되었습니다.' });
		} catch (err) {
			if (err instanceof ApiError) {
				res.status(err.status).json({ message: err.message });
			} else {
				next(err);
			}
		}
	};

	/* 유저 1건 조회 */
	getUserById = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const user = await this.usersService.findUserById(+userId);

			return res.status(200).json({ data: user });
		} catch (err) {
			if (err instanceof ApiError) {
				res.status(err.status).json({ message: err.message });
			} else {
				next(err);
			}
		}
	};

	/* 회원정보 업데이트 */
	updateUserInfo = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const { userName, authCode } = req.body;

			const updatedUser = await this.usersService.updateUserInfo(
				userId,
				userName,
				authCode,
			);

			return res.status(200).json({ data: updatedUser });
		} catch (err) {
			if (err instanceof ApiError) {
				res.status(err.status).json({ message: err.message });
			} else {
				next(err);
			}
		}
	};

	/* 회원 탈퇴 */
	deleteUser = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const deletedUser = await this.usersService.deleteUser(userId);
			return res.status(200).json({ data: deletedUser });
		} catch (err) {
			next(err);
		}
	};

	/* 로그아웃 */
	userSignOut = async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) {
				throw new ApiError(400, `로그아웃할 사용자 정보가 없습니다.`);
			}

			const existingToken =
				await this.usersService.findRefreshToken(refreshToken);

			if (existingToken) {
				const signout =
					await this.usersService.deleteRefreshToken(refreshToken);
			}

			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');

			return res
				.status(200)
				.json({ message: '성공적으로 로그아웃되었습니다.' });
		} catch (err) {
			next(err);
		}
	};
}
