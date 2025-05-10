import type { AppLoadContext } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "./createServerClient";

export const siginInWithGitHub = async (
	request: Request,
	c: AppLoadContext,
) => {
	const redirectUrl = `${c.cloudflare.env.FRONTEND_URL}/home`;
	const supabase = createSupabaseServerClient(request, c);
	const { data, error } = await supabase.client.auth.signInWithOAuth({
		provider: "github",
		options: {
			redirectTo: redirectUrl,
		},
	});

	return {
		ok: !!data && !error,
		data: data,
		error: error && !data ? error.message : "",
		headers: supabase.headers,
	};
};

export const signOut = async (
	request: Request,
	c: AppLoadContext,
) => {
	const redirectUrl = `${c.cloudflare.env.FRONTEND_URL}/login`;
	const supabase = createSupabaseServerClient(request, c);
	const { error } = await supabase.client.auth.signOut();

	return {
		ok: !error,
		data: { url: redirectUrl },
		error: error ? error.message : "",
		headers: supabase.headers,
	};
};

export const getUser = async (request: Request, c: AppLoadContext) => {
	const supabase = createSupabaseServerClient(request, c);

	const {
		data: { session },
	} = await supabase.client.auth.getSession();

	return session?.user ?? null;
};

export const isUserLoggedIn = async (request: Request, c: AppLoadContext) => {
	const supabase = createSupabaseServerClient(request, c);

	const {
		data: { user },
	} = await supabase.client.auth.getUser();

	return !!user;
};

export const getSessionFromCode = async (
	request: Request,
	c: AppLoadContext,
	code: string,
) => {
	const supabase = createSupabaseServerClient(request, c);

	const { data, error } =
		await supabase.client.auth.exchangeCodeForSession(code);

	if (error) {
		console.error("Error exchanging code for session:", error);
		throw error;
	}

	return { data };
};
