import { type LoaderFunctionArgs, type MetaFunction, redirect } from "@remix-run/cloudflare";
import { isUserLoggedIn } from "~/utils/auth";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
	if (!isUserLoggedIn(request, context)) {
		return redirect("/login");
	}
	return redirect("/home");
}

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Remix - INDEX PAGE</h1>
		</div>
	);
}
