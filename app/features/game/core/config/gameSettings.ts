import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./config";

/**
 * ゲーム設定を管理するオブジェクト
 */
export const defaultGameSettings = {
	physics: {
		gravity: { x: 0, y: 0 },
		debug: false,
	},
	display: {
		width: DISPLAY_WIDTH,
		height: DISPLAY_HEIGHT,
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
};

export type GameSettings = typeof defaultGameSettings;
