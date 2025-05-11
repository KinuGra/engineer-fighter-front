import { getGitHubToken } from "./cookies.server";

export const fetchGitHubApi = async (request: Request) => {
	const token = await getGitHubToken(request);

	if (!token) {
		return {
			error: "No GitHub token found",
			status: 401,
			data: null,
		};
	}

	const response = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `token ${token}`,
			Accept: "application/json",
			"User-Agent": "58-supabase",
		},
	});

	if (response.status !== 200) {
		return {
			error: "Failed to fetch GitHub user info",
			status: response.status,
			data: null,
		};
	}

	const userData = await response.json();
	return {
		error: null,
		status: 200,
		data: userData,
	};
};
