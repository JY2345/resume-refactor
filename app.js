import express from 'express';
import cookieParser from 'cookie-parser';
import { swaggerUi, specs } from './utils/swagger.js';
import UsersRouter from './routers/users.router.js';
import ResumesRouter from './routers/resumes.router.js';
import KakaoAuthRouter from './routers/auth.router.js';
import {
	createAccessToken,
	createRefreshToken,
	saveRefreshToken,
} from './utils/tokenService.js';

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', [UsersRouter, ResumesRouter]);
app.use('/auth', KakaoAuthRouter);

app.post('/tokens', (req, res) => {
	const { id } = req.body;
	const accessToken = createAccessToken(id);
	const refreshToken = createRefreshToken(id);

	saveRefreshToken(id, refreshToken);

	res.cookie('accessToken', accessToken);
	res.cookie('refreshToken', refreshToken);

	return res
		.status(200)
		.json({ message: 'Token이 정상적으로 발급되었습니다.' });
});

app.get('/', (req, res) => {
	return res.status(200).send('Hello!');
});

app.listen(PORT, () => {
	console.log(PORT, '포트로 서버가 열렸어요!');
});
