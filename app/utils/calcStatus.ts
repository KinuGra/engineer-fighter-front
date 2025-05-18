import type { GitHubGraphQL } from "~/types/github";

export type UserStatus = {
	power: number; // 1~100
	weight: number; // 1~100
	volume: number; // 1~100
	cd: number; // 1000~5000 (ms)
};

const normalize = (
	value: number,
	maxValue: number,
	min = 1,
	max = 100,
): number => {
	if (value <= 0) return min;
	const normalized = (value / maxValue) * (max - min) + min;
	return Math.min(Math.max(Math.round(normalized), min), max);
};

const calcStatus = (info: GitHubGraphQL | null): UserStatus => {
	if (!info) {
		return {
			power: 0,
			weight: 0,
			volume: 0,
			cd: 0,
		};
	}

	const {
		contributionCount,
		commitStreak,
		commitDays,
		totalPullRequestContributions,
		totalIssueContributions,
	} = info;

	const rawPower = contributionCount * commitStreak;
	const power = normalize(rawPower, 20000);

	const weight = normalize(commitDays, 365);
	const volume = normalize(commitDays, 365);

	const prAndIssue = totalPullRequestContributions + totalIssueContributions;

	// Normalize to 0~100 (higher = better), then invert to 5000~1000ms
	const cdNormalized = normalize(prAndIssue, 500); // → 1〜100
	const cd = Math.round(5000 - ((cdNormalized - 1) / 99) * 4000); // → 5000〜1000

	return {
		power,
		weight,
		volume,
		cd,
	};
};

export default calcStatus;
