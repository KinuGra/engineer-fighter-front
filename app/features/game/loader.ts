import { data } from "@remix-run/cloudflare";
import { defaultGameSettings } from "./config/gameSettings";

/**
 * ゲーム設定を取得するローダー関数
 */
export async function getGameSettings() {
  // 必要に応じてここでAPIからの取得や設定のカスタマイズを行う
  const gameSettings = defaultGameSettings;
  
  return data({ gameSettings });
}
