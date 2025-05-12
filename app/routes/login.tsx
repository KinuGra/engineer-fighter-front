import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { isUserLoggedIn, siginInWithGitHub } from "~/utils/auth.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	if (await isUserLoggedIn(request, context)) {
		return redirect("/home");
	}
	return null;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const { data, headers } = await siginInWithGitHub(request, context);

	if (!data.url) {
		throw new Error("Redirect URL is missing");
	}
	return redirect(data.url, { headers: headers });
};

export default function SignIn() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
				<h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
					Engineer Fighters
				</h2>
				<p className="mb-6 text-center text-gray-600 text-base">
					GitHubアカウントでログインして始めましょう
				</p>
				<Form method="post">
					<button
						type="submit"
						className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-4 py-3 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					>
						<svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
							<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
						</svg>
						<span className="text-base font-medium">GitHubでログイン</span>
					</button>
				</Form>
			</div>
		</div>
	);
}
