import { env } from '$env/dynamic/private';
import mysql from 'mysql2';

// console.log(ENV);
const db =
	global.db ||
	mysql
		.createPool({
			host: env.MYSQL_HOST,
			user: env.MYSQL_USER,
			password: env.MYSQL_PASSWORD,
			database: env.MYSQL_DATABASE,
			dateStrings: true
		})
		.promise();
if (env.ENV === 'development') {
	global.db = db;
}
export { db };
