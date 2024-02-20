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

            console.log("controller : " + password)

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

	/* 유저 1건 조회 */
	getUserById = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const user = await this.usersService.findUserById(+userId);
			if (!user) {
				throw new ApiError(
					404,
					`해당 유저가 존재하지 않습니다.`,
				);
			}

			return res.status(200).json({ data: user });
		} catch (err) {
			if (err instanceof ApiError) {
				res.status(err.status).json({ message: err.message });
			} else {
				res.status(500).json({ message: '서버에서 에러가 발생했습니다.' });
			}
		}
	};

	/* 회원정보 업데이트 */
	updateUserInfo = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const { userName, email, authCode } = req.body;

			const updatedUser = await this.usersService.updateUserInfo({
				userId,
                userName,
				email,
                authCode,
			});

			return res.status(200).json({ data: updatedUser });
		} catch (err) {
			next(err);
		}
	};

	/* 회원 탈퇴 */
	userSignOut = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const deletedUser = await this.usersService.deleteUser(userId);
			return res.status(200).json({ data: deletedUser });
		} catch (err) {
			next(err);
		}
	};
}
