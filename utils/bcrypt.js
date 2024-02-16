import bcrypt from 'bcrypt';

export async function hashPassword(password) {
	const saltRounds = 10;
	try {
		return await bcrypt.hash(password, saltRounds);
	} catch (error) {
		console.error('패스워드 암호화 처리 에러 :', error);
		throw error;
	}
}

export async function checkPassword(inputPassword, storedHash) {
	try {
		return await bcrypt.compare(inputPassword, storedHash);
	} catch (error) {
		console.error('패스워드 확인 에러 :', error);
		throw error;
	}
}
