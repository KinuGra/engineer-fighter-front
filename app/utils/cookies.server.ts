import { createCookie } from "@remix-run/cloudflare";

export const userCookie = createCookie("58hack-github-token", {
	httpOnly: true,
	secure: true,
	path: "/",
	sameSite: "lax",
	expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 7),
});

export const getGitHubToken = async (request: Request) => {
	const cookieHeader = request.headers.get("Cookie");
	if (!cookieHeader) return null;

	const cookies = cookieHeader.split(";").map((c) => c.trim());
	const tokenCookie = cookies.find((c) => c.startsWith("58hack-github-token="));
	if (!tokenCookie) return null;

	const token = tokenCookie.split("=")[1];
	return token;
};
