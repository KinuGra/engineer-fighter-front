import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { serializeCookieHeader } from "@supabase/ssr";
import RoomCard from "~/components/RoomCard";
import { signOut } from "~/utils/auth.server";
import { fetchGitHubApi } from "~/utils/github.server";
import type { GitHubUser } from "~/types/github";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const result = await fetchGitHubApi(request);
	if (result.error) {
		return null;
	}
	return result.data;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const { data, headers } = await signOut(request, context);
	headers.append(
		"Set-Cookie",
		serializeCookieHeader("58hack-github-token", "", {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: "lax",
			expires: new Date(0),
		}),
	);
	return redirect(data.url, { headers });
};

export default function Home() {
	const data = useLoaderData<GitHubUser | null>();

	return (
		<div className="w-full flex flex-col items-center px-4 md:px-5">
			{/* メインカード部分 */}
			<div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center mt-8">
				<RoomCard
					title="部屋を作成する"
					description="新しいゲーム部屋を作成して友達を招待しましょう"
					icon="create"
					onClick={() => {
						// TODO: 部屋作成処理
					}}
				/>
				<RoomCard
					title="部屋に参加する"
					description="友達が作成した部屋に参加しましょう"
					icon="join"
					onClick={() => {
						// TODO: 部屋参加処理
					}}
				/>
			</div>
		</div>
	);
}
