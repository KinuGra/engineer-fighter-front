import {
	type LoaderFunctionArgs,
	type MetaFunction,
	redirect,
} from "@remix-run/cloudflare";
import { isUserLoggedIn } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
	if (await isUserLoggedIn(request, context)) {
		return redirect("/home");
	}
	return redirect("/auth/login");
}

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Remix - INDEX PAGE</h1>
		</div>
	);
}
