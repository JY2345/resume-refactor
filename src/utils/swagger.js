import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'API 테스트용',
		version: '1.0.0',
		description: 'API 테스트용',
	},
	servers: [
		{
			url: 'http://localhost:3018',
		},
		{
			url: 'http://sereneva.shop:3018',
		},
		{
			url: 'http://3.39.177.26:3018',
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ['./swagger/*.js'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
