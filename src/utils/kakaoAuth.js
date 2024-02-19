import axios from 'axios';

/**
 * 서버에 카카오 액세스 토큰을 전송하는 함수
 * @param {string} token - 카카오 로그인으로부터 받은 액세스 토큰
 */
export const sendKakaoTokenToServer = async (token) => {
	try {
		const serverEndpoint = process.env.CONNECTION_URI + '/api/sign-in';

		const data = {
			kakaoAccessToken: token,
		};

		const response = await axios.post(serverEndpoint, data);

		console.log('성공적으로 전송:', response.data);
	} catch (error) {
		console.error(
			'서버에 카카오 토큰 전송하는데 에러남 :',
			error.response ? error.response.data : error.message,
		);
		throw new Error('카카오 서버 오류 발생');
	}
};

export const getUserInfo = async (accessToken) => {
	try {
		const userInfoResponse = await axios({
			method: 'GET',
			url: 'https://kapi.kakao.com/v2/user/me',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return userInfoResponse.data;
	} catch (error) {
		console.error('유저 정보 fetch 오류 :', error);
		throw new Error('카카오 로그인 중 오류 발생');
	}
};

export async function displayUserInfo(accessToken) {
	try {
		const userInfo = await getUserInfo(accessToken);
		return userInfo.kakao_account;
	} catch (error) {
		console.error(error);
		throw new Error('카카오 유저 정보 로드 중 오류 발생');
	}
}
