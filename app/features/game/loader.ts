import { type LoaderFunctionArgs, data } from "@remix-run/cloudflare";
import { defaultGameSettings } from "./core/config/gameSettings";

/**
 * ゲーム設定を取得するローダー関数
 */
export async function getGameSettings({ context }: LoaderFunctionArgs) {
	const apiUrl = context.cloudflare.env.API_URL;

	const gameSettings = defaultGameSettings;
	return data({ apiUrl, gameSettings });
}
