const DISPLAY_WIDTH = process.env.DISPLAY_WIDTH as unknown as number;
const DISPLAY_HEIGHT = process.env.DISPLAY_HEIGHT as unknown as number;
if(!DISPLAY_WIDTH || !DISPLAY_HEIGHT) throw new Error("環境変数が設定されていません：DISPLAY_WIDTH, DISPLAY_HEIGHT");
if (isNaN(DISPLAY_WIDTH) || isNaN(DISPLAY_HEIGHT)) throw new Error("環境変数が不正です：DISPLAY_WIDTH, DISPLAY_HEIGHT");

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
