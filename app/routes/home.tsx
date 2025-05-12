import {
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    redirect,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { serializeCookieHeader } from "@supabase/ssr";
import SignOutButton from "~/components/SignOutButton";
import { fetchGitHubApi } from "~/utils/github.server";
import { signOut } from "~/utils/auth.server";

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
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center px-4 md:px-5">
            {/* ヘッダー部分 */}
            <div className="w-full flex items-center justify-between px-8 py-6">
                <div className="flex items-center space-x-4">
                    {data && (
                        <>
                            <img
                                src={data.avatar_url}
                                alt="avatar"
                                className="w-12 h-12 rounded-full bg-gray-200"
                            />
                            <div>
                                <div className="text-xl font-bold">こんにちは、{data.name} さん</div>
                                <div className="text-gray-500 text-sm">@{data.login}</div>
                            </div>
                        </>
                    )}
                </div>
                <div>
                    <SignOutButton />
                </div>
            </div>

            {/* メインカード部分 */}
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center mt-8">
                {/* 部屋を作成するカード */}
                <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                    <div className="text-2xl font-bold mb-2">部屋を作成する</div>
                    <div className="text-gray-500 mb-6">新しいゲーム部屋を作成して友達を招待しましょう</div>
                    <div className="flex items-center justify-center mb-6 h-20">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    </div>
                    <button className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition">部屋を作成</button>
                </div>
                {/* 部屋に参加するカード */}
                <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                    <div className="text-2xl font-bold mb-2">部屋に参加する</div>
                    <div className="text-gray-500 mb-6">友達が作成した部屋に参加しましょう</div>
                    <div className="flex items-center justify-center mb-6 h-20">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
                    </div>
                    <button className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition">部屋に参加</button>
                </div>
            </div>
        </div>
    );
}

