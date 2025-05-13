import { useEffect, useRef } from "react";
import type { GameSettings } from "../config/gameSettings";

interface PhaserGameProps {
	gameSettings: GameSettings;
}

/**
 * Phaserゲームコンポーネント
 *
 * @param props.gameSettings ゲーム設定
 */
export default function PhaserGame({ gameSettings }: PhaserGameProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const gameInitializedRef = useRef<boolean>(false);

	useEffect(() => {
		let game: Phaser.Game | undefined;

		const loadPhaser = async () => {
			if (gameInitializedRef.current || !containerRef.current) {
				return;
			}

			try {
				// Phaserはクライアント側でのみインポート
				// @ts-expect-error 動的インポート(tsconfig.jsonでのmodules設定に依存)
				const Phaser = (await import("phaser")).default;
				if (
					!containerRef.current ||
					containerRef.current.querySelector("canvas")
				) {
					return;
				}

				// ゲーム設定を使用してPhaser.Gameを初期化
				const config: Phaser.Types.Core.GameConfig = {
					type: Phaser.AUTO,
					width: gameSettings.display.width,
					height: gameSettings.display.height,
					parent: containerRef.current || undefined,
					physics: {
						default: "arcade",
						arcade: {
							gravity: gameSettings.physics.gravity,
							debug: gameSettings.physics.debug,
						},
					},
					scene: {
						preload: function (this: Phaser.Scene) {
							this.load.setBaseURL(gameSettings.assets.baseUrl);
							gameSettings.assets.images.forEach((img) => {
								this.load.image(img.key, img.path);
							});
						},
						create: function (this: Phaser.Scene) {
							this.add.image(400, 300, "sky");

							// パーティクルエミッターを作成
							const particles = this.add.particles(0, 0, "red", {
								speed: 100,
								scale: { start: 1, end: 0 },
								blendMode: "ADD",
							});

							// ロゴに物理演算を適用
							const logo = this.physics.add.image(400, 100, "logo");
							logo.setVelocity(100, 200);
							logo.setBounce(1, 1);
							logo.setCollideWorldBounds(true);

							// パーティクルをロゴに追従させる
							particles.startFollow(logo);
						},
					},
				};

				// ゲームインスタンスを作成
				game = new Phaser.Game(config);
				gameInitializedRef.current = true;
			} catch (error) {
				console.error("Failed to initialize Phaser:", error);
			}
		};

		loadPhaser();

		// クリーンアップ時にゲームを破棄
		return () => {
			if (game) {
				game.destroy(true);
				gameInitializedRef.current = false;
			}
		};
	}, [gameSettings]); // gameSettingsが変更された場合に再初期化

	return (
		<div
			ref={containerRef}
			id="phaser-container"
			className="w-[800px] h-[600px]"
		/>
	);
}
