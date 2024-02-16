/**
 * @swagger
 * paths:
 *   /api/users:
 *     post:
 *       summary: 새 사용자 등록
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 authCode:
 *                   type: string
 *       responses:
 *         201:
 *           description: 사용자 등록 성공
 *         409:
 *           description: 이미 존재하는 이메일
 *     get:
 *       summary: 내 정보 조회
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: 사용자 정보 조회 성공
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *   /api/users/{userId}:
 *     delete:
 *       summary: 회원 삭제(탈퇴)
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: integer
 *           description: 탈퇴할 사용자 ID
 *       responses:
 *         200:
 *           description: 성공적으로 탈퇴되었습니다.
 *         400:
 *           description: 잘못된 요청입니다. (탈퇴할 아이디 확인 불가 또는 토큰 확인 불가)
 *         403:
 *           description: 본인만 탈퇴 가능합니다. 또는 관리자 권한이 필요합니다.
 *         404:
 *           description: 탈퇴할 사용자 조회에 실패하였습니다.
 *         500:
 *           description: 서버 오류가 발생했습니다.
 *   /api/sign-in:
 *     post:
 *       summary: 로그인
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: 로그인 성공
 *         401:
 *           description: 존재하지 않는 이메일 또는 비밀번호 불일치
 *   /api/sign-out:
 *     post:
 *       summary: 사용자 로그아웃
 *       tags: [Users]
 *       responses:
 *         200:
 *           description: 로그아웃 성공. 사용자의 리프레시 토큰이 무효화되고, 클라이언트는 인증 토큰을 삭제합니다.
 *         400:
 *           description: 잘못된 요청. 로그아웃할 사용자 정보가 없습니다.
 *         500:
 *           description: 서버 내부 오류
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         userName:
 *           type: string
 *           description: 사용자 이름
 *         email:
 *           type: string
 *           description: 사용자 이메일
 *         authCode:
 *           type: string
 *           description: 사용자 권한 코드
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 시간
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최근 업데이트 시간
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
