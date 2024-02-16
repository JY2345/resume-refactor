/**
 * @swagger
 * paths:
 *   /api/resumes:
 *     get:
 *       summary: 이력서 목록을 조회
 *       tags: [Resumes]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: orderKey
 *           schema:
 *             type: string
 *           description: "정렬할 필드명 (예: 'createdAt', 'userId')"
 *           required: false
 *         - in: query
 *           name: orderValue
 *           schema:
 *             type: string
 *             enum: [ASC, DESC]
 *           description: 정렬 방식 (ASC 또는 DESC, 기본값은 DESC)
 *           required: false
 *       responses:
 *         200:
 *           description: 이력서 목록을 반환
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Resume'
 *         401:
 *           description: 인증되지 않은 사용자의 요청
 *         403:
 *           description: 관리자 권한이 필요한 요청
 *         500:
 *           description: 서버 오류
 *     post:
 *       summary: 새 이력서를 등록
 *       tags: [Resumes]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - userId
 *                 - title
 *                 - contents
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: 이력서를 등록할 사용자의 ID
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: 이력서 제목
 *                   example: "이력서 제목"
 *                 contents:
 *                   type: string
 *                   description: 이력서 내용(자기소개)
 *                   example: "테스트용 두번째 자기소개!"
 *                 statusCode:
 *                   type: string
 *                   description: 이력서의 상태 코드
 *                   example: ""
 *       responses:
 *         201:
 *           description: 이력서가 정상적으로 등록되었습니다.
 *         401:
 *           description: 회원 정보를 찾을 수 없거나, 이력서 제목/내용이 누락되었습니다.
 *         409:
 *           description: 존재하지 않는 회원입니다.
 *         500:
 *           description: 서버 오류
 *
 *   /api/resumes/{resumeId}:
 *     get :
 *      summary: 특정 이력서를 조회
 *      description: 이력서 ID에 해당하는 이력서의 상세 정보를 조회
 *      tags: [Resumes]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: resumeId
 *          required: true
 *          schema:
 *              type: integer
 *          description: 조회할 이력서의 고유 ID
 *      responses:
 *          200:
 *              description: 성공적으로 이력서 정보를 조회함
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      resumeId:
 *                                        type: integer
 *                                        description: 이력서의 고유 ID
 *                                      userId:
 *                                        type: integer
 *                                        description: 이력서를 생성한 사용자 ID
 *                                      title:
 *                                        type: string
 *                                        description: 이력서의 제목
 *                                      contents:
 *                                        type: string
 *                                        description: 이력서의 내용
 *                                      statusCode:
 *                                        type: integer
 *                                        description: 이력서의 상태 코드
 *                                      createdAt:
 *                                         type: string
 *                                         format: date-time
 *                                         description: 이력서 생성 일시
 *                                      updatedAt:
 *                                         type: string
 *                                         format: date-time
 *                                         description: 이력서 최종 수정 일시
 *                                      user:
 *                                         type: object
 *                                         properties:
 *                                            userName:
 *                                              type: string
 *                                              description: 이력서를 생성한 사용자의 이름
 *
 *     delete:
 *      summary: 특정 이력서를 삭제
 *      tags: [Resumes]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: resumeId
 *          required: true
 *          schema:
 *              type: integer
 *          description: 삭제할 이력서의 ID
 *      responses:
 *          200:
 *              description: 이력서가 성공적으로 삭제되었습니다.
 *          403:
 *              description: 본인의 이력서만 삭제하실 수 있습니다. 또는 관리자 권한이 필요합니다.
 *          404:
 *              description: 이력서 조회에 실패하였습니다. 해당 ID의 이력서가 존재하지 않습니다.
 *          500:
 *              description: 서버 오류
 * components:
 *   schemas:
 *     Resume:
 *       type: object
 *       properties:
 *         resumeId:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 123
 *         title:
 *           type: string
 *           example: "이력서 제목"
 *         contents:
 *           type: string
 *           example: "자기소개 내용"
 *         statusCode:
 *           type: string
 *           example: "APPLY"
 *         user:
 *           $ref: '#/components/schemas/User'
 *     User:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           example: "스파르타"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
