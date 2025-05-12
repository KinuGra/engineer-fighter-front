import { data } from "@remix-run/cloudflare";
import { defaultGameSettings } from "./config/gameSettings";

/**
 * ゲーム設定を取得するローダー関数
 */
export async function getGameSettings() {
  const gameSettings = defaultGameSettings;
  return data({ gameSettings });
}
