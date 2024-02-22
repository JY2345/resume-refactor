import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
	type: 'mysql',
	host: process.env.DATABASE_URL,
	port: process.env.DATABASE_PORT,
	username: process.env.DATABASE_USERID,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DBNAME,
	synchronize: true,
	entities: [
		require('./entities/users.entity.js'),
		require('./entities/resumes.entity.js'),
	],
});
