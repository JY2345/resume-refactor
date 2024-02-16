/**
 * @swagger
 * /tokens:
 *   post:
 *     summary: 사용자 ID를 기반으로 액세스 토큰과 리프레시 토큰을 생성
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: 사용자 ID
 *     responses:
 *       200:
 *         description: 토큰이 정상적으로 발급되었습니다. 액세스 토큰과 리프레시 토큰이 쿠키에 설정됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token이 정상적으로 발급되었습니다.
 *       400:
 *         description: 잘못된 요청. 필요한 파라미터가 누락되었습니다.
 *       500:
 *         description: 서버 내부 오류
 */
