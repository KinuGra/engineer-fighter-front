export const getOrigin = (request: Request) => {
	const url = new URL(request.url);
	const origin = `${url.protocol}//${url.host}`;
	return origin;
};
