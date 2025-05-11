import { redirect  } from "@remix-run/cloudflare";
import type {LoaderFunctionArgs} from "@remix-run/cloudflare";
import { getSessionFromCode } from "~/utils/auth.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/home";

  if (code) {
    const { error, headers } = await getSessionFromCode(request, context, code);
    if (!error) {
      return redirect(next, { headers });
    }
  }

  return redirect("/error");
}