export type GitHubUser = {
	avatar_url: string;
	name: string;
	login: string;
};

export type GitHubGraphQL = {
	contributionCount: number;
	commitStreak: number;
	commitDays: number;
	totalPullRequestContributions: number;
	totalIssueContributions: number;
};
