/**
 * プレイヤーステータスの型定義
 */
export interface PlayerData {
  id: string;
  icon: string;
  power: number; // 力の強さ
  weight: number; // 重さ
  volume: number; // 体積
  cd: number; // クールダウン時間
  isMainPlayer?: boolean; // メインプレイヤーかどうか
  x?: number; // 初期x座標
  y?: number; // 初期y座標
}

/**
 * ゲーム設定を管理するオブジェクト
 */
export const defaultGameSettings = {
	physics: {
		gravity: { x: 0, y: 0 },
		debug: false,
	},
	display: {
		width: 800,
		height: 600,
	},
	userPreferences: {
		controls: "keyboard",
	},
	// アセット情報
	assets: {
		baseUrl: "https://labs.phaser.io",
		images: [
			{ key: "sky", path: "assets/skies/space3.png" },
			{ key: "logo", path: "assets/sprites/phaser3-logo.png" },
			{ key: "red", path: "assets/particles/red.png" },
		],
	},
	// プレイヤーデータ情報
	players: [] as PlayerData[],
};

export type GameSettings = typeof defaultGameSettings;
