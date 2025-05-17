import { atom } from "jotai";
import type { GitHubGraphQL, GitHubUser } from "~/types/github";

// GitHubユーザー情報を保持するatom
export const githubUserAtom = atom<GitHubUser | null>(null);
export const githubGraphQLAtom = atom<GitHubGraphQL | null>(null);
