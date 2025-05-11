import { createCookie } from "@remix-run/cloudflare";

export const userGitHubToken = createCookie("58hack-github-token", {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 60_00),
  });