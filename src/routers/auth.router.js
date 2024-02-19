import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import passportKakao from 'passport-kakao';
import { sendKakaoTokenToServer } from '../utils/kakaoAuth.js';
const KakaoStrategy = passportKakao.Strategy;
const kakao = {
	clientID: process.env.REACT_APP_KAKAO_REST_KEY,
	redirectUri: process.env.KAKAO_REDIRECT_URI,
};

const router = express.Router();

router.get('/kakao', (req, res) => {
	const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code`;

	return res.redirect(kakaoAuthUrl);
});

/**
 * @summary '사용자 서비스 동의' 완료 후, 이동되는 주소.
 * @description
 * - 사용자로부터 동의를 구한 후, 서비스 내에서 처리할 로직을 구현
 */
router.get('/kakao/callback', async (req, res) => {
	try {
		const { code } = req.query;
		const redirect_uri = kakao.redirectUri;

		console.log('처음 : ' + redirect_uri);

		const data = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: kakao.clientID,
			redirect_uri,
			code,
		});

		console.log('0 : ' + data);

		const response = await axios.post(
			'https://kauth.kakao.com/oauth/token',
			data.toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		);

		const accessToken = response.data.access_token;
		console.log('1 : ' + JSON.stringify(response.data, null, 2));
		sendKakaoTokenToServer(accessToken);
		res.send('카카오 로그인 성공');
	} catch (e) {
		console.error(e);
		res.status(500).send('인증 중 오류 발생');
	}
});

export default router;
