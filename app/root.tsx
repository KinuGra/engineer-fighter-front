import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import { serializeCookieHeader } from "@supabase/ssr";
import { useAtom } from "jotai";
import { useEffect } from "react";
import type { GitHubUser } from "~/types/github";
import { githubUserAtom } from "~/atoms/githubUser";
import Header from "./components/Header";
import { authCookies } from "./const";
import { signOut } from "./utils/auth.server";
import { fetchGitHubApi } from "./utils/github.server";

import "./tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const result = await fetchGitHubApi(request);
	if (result.error) {
		return null;
	}
	return result.data;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const { data, headers } = await signOut(request, context);
	authCookies.map((cookie: string) => {
		headers.append(
			"Set-Cookie",
			serializeCookieHeader(cookie, "", {
				httpOnly: true,
				secure: true,
				path: "/",
				sameSite: "lax",
				expires: new Date(0),
			}),
		);
	});
	return redirect(data.url, { headers });
};

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const user = useLoaderData<GitHubUser | null>();
	const [, setGithubUser] = useAtom(githubUserAtom);
	
	useEffect(() => {
		if (user) {
			setGithubUser(user);
		}
	}, [user, setGithubUser]);

	return (
		<div>
			<Header user={user} />
			<Outlet />
		</div>
	);
}
