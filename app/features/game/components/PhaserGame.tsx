import { useEffect, useRef } from "react";
import type { GameSettings } from "../core/config/gameSettings";
import { createGameConfig } from "../core/config/configLoader";

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

  // クライアントサイドの処理のため、loader ではなく useEffect で処理している
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

        // configLoaderを使用してゲーム設定を取得
        const config = await createGameConfig(gameSettings, containerRef.current);

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
