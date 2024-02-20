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
    userSignIn = async (req, res, next) =>{
        try {
			const { email, password } = req.body;
			const user = await this.usersService.findUserByEmail(email);

			if (!user) {
				throw new ApiError(
					404,
					`해당 유저가 존재하지 않습니다.`,
				);
			}

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
    }

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
			const { userName, email, authCode } = req.body;

			const updatedUser = await this.usersService.updateUserInfo({
				userId,
                userName,
				email,
                authCode,
			});

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
