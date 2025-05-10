import type { AppLoadContext } from "@remix-run/cloudflare";
import {
	createServerClient,
	parseCookieHeader,
	serializeCookieHeader,
} from "@supabase/ssr";

export function createSupabaseServerClient(
	request: Request,
	c: AppLoadContext,
) {
	const headers = new Headers();

	const client = createServerClient(
		c.cloudflare.env.SUPABASE_URL,
		c.cloudflare.env.SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "").filter(
						(cookie): cookie is { name: string; value: string } =>
							cookie.value !== undefined,
					);
				},
				setAll(cookiesToSet) {
					for (const cookie of cookiesToSet) {
						const { name, value, options } = cookie;
						headers.append(
							"Set-Cookie",
							serializeCookieHeader(name, value, options),
						);
					}
				},
			},
			cookieOptions: {
				httpOnly: true,
				secure: true,
			},
		},
	);

	return {
		client,
		headers,
	};
}
