import { atom } from "jotai";
import type { GitHubUser } from "~/types/github";

// GitHubユーザー情報を保持するatom
export const githubUserAtom = atom<GitHubUser | null>(null);
