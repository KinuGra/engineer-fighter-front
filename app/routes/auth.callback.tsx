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
			if (data.session?.provider_token) {
				headers.append(
					"Set-Cookie",
					serializeCookieHeader(
						"58hack-github-token",
						data.session.provider_token,
						{
							httpOnly: true,
							secure: true,
							path: "/",
							sameSite: "lax",
							expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 30),
						},
					),
				);
				headers.append(
					"Set-Cookie",
					serializeCookieHeader("58hack-user-id", data.session.user.id, {
						httpOnly: false,
						secure: true,
						path: "/",
						sameSite: "lax",
						expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 30),
					}),
				);
			}
			return redirect(next, { headers });
		}
	}

	return redirect("/error");
}
