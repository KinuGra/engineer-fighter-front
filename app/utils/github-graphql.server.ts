import { Octokit } from "@octokit/core";
import dayjs from "dayjs";
import { getGitHubToken } from "./cookies.server";

export type Contributions = {
	viewer: {
		contributionsCollection: {
			contributionCalendar: {
				weeks: {
					contributionDays: {
						date: string;
						contributionCount: number;
					}[];
				}[];
			};
			totalPullRequestContributions: number;
			totalIssueContributions: number;
		};
	};
};

export type MyContributes = {
	values: number[];
};

export default async function fetchGitHubGraphQL(request: Request) {
	const token = await getGitHubToken(request);
	if (!token) {
		return {
			error: "No GitHub token found",
			status: 401,
			data: null,
		};
	}

	const octokit = new Octokit({
		auth: token,
	});

	const now = await dayjs().format("YYYY-MM-DDThh:mm:ss");
	const sixMonthBefore = await dayjs()
		.subtract(12, "month")
		.format("YYYY-MM-DDThh:mm:ss");

	/**
	 * クエリ部分
	 * @param to
	 * @param from
	 */
	const query = `
    query contributions($to: DateTime!, $from: DateTime!) {
        viewer {
            contributionsCollection(to: $to, from: $from) {
                contributionCalendar {
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                        }
                    }
                }
                totalPullRequestContributions
                totalIssueContributions
            }
        }
    }
    `;

	const contributions = await octokit.graphql<Contributions>(query, {
		to: now,
		from: sixMonthBefore,
	});

	let contributionCount = 0;
	let commitStreak = 0;
	let commitDays = 0;
	let finishStreak = false;

	const { totalPullRequestContributions, totalIssueContributions } =
		contributions.viewer.contributionsCollection;

	for (const week of contributions.viewer.contributionsCollection
		.contributionCalendar.weeks) {
		for (const contributionDay of week.contributionDays) {
			contributionCount += contributionDay.contributionCount;
			if (contributionDay.contributionCount > 0) {
				commitDays++;
				if (!finishStreak) {
					commitStreak++;
				}
			} else {
				if (commitStreak > 0) {
					finishStreak = true;
				} else {
					commitStreak = 0;
				}
			}
		}
	}

	return {
		error: null,
		status: 200,
		data: {
			contributionCount, // 直近1年のcommit数
			commitStreak, // commit連続日数
			commitDays, // 直近1年のcommit日数
			totalPullRequestContributions, // PR数
			totalIssueContributions, // Issue数
		},
	};
}
