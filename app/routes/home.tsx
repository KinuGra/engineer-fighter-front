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

export async function loader({ request }: LoaderFunctionArgs) {
	const result = await fetchGitHubApi(request);

	if (result.error) {
		return null;
	}

	return result.data;
}

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

export default function AuthCode() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
				<h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
					ようこそ、{data?.login}さん
				</h2>

				{data && (
					<div className="mb-6 rounded-md bg-gray-100 p-4">
						<div className="flex items-center">
							<img
								src={data.avatar_url}
								alt="User Avatar"
								className="mr-4 h-12 w-12 rounded-full"
							/>
							<div>
								<h3 className="font-bold text-gray-800">{data.login}</h3>
							</div>
						</div>
					</div>
				)}

				<SignOutButton />
			</div>
		</div>
	);
}
