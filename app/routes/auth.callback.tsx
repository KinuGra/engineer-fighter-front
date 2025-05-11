import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { serializeCookieHeader } from "@supabase/ssr";
import { getSessionFromCode } from "~/utils/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const next = requestUrl.searchParams.get("next") ?? "/home";

	if (code) {
		const { data, error, headers } = await getSessionFromCode(
			request,
			context,
			code,
		);
		if (!error) {
			if (data.session?.access_token) {
				console.log("access_token", data.session.access_token);
				headers.append(
					"Set-Cookie",
					serializeCookieHeader(
						"58hack-github-token",
						data.session.access_token,
						{
							httpOnly: true,
							secure: true,
							path: "/",
							sameSite: "lax",
						},
					),
				);
			}
			return redirect(next, { headers });
		}
	}

	return redirect("/error");
}
