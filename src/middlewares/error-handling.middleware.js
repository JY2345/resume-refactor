export const ErrorHandlingMiddleware = (err, req, res, next) => {
	console.log('test');
};

export class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}
