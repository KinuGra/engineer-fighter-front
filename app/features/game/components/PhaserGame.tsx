import { useEffect, useRef } from "react";
import type { GameSettings } from "../core/config/gameSettings";
import { createGameConfig } from "../core/config/configLoader";
import { ClientOnly } from "remix-utils/client-only";

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

  // Phaserの初期化処理をClientOnlyの外に出し、コンテナ要素が存在する場合のみ実行する
  const initPhaser = async () => {
    if (!containerRef.current || gameInitializedRef.current) return;
    if (containerRef.current.querySelector("canvas")) return;

    try {
      const config = await createGameConfig(
        gameSettings,
        containerRef.current
      );

      const game = new Phaser.Game(config);
      gameInitializedRef.current = true;

      // コンポーネントのアンマウント時にゲームを破棄するためにcleanup関数を返す
      return () => {
        if (game) {
          game.destroy(true);
          gameInitializedRef.current = false;
        }
      };
    } catch (error) {
      console.error("Failed to initialize Phaser:", error);
    }
  };

  // クライアントサイドの処理のため、useEffectを使用する
  useEffect(() => {
    // ClientOnlyの中でレンダリングされた後にPhaserを初期化するため、
    // setTimeout を使って非同期にする
    const timeoutId = setTimeout(() => {
      initPhaser();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ClientOnly>
      {() => (
        <div
          ref={containerRef}
          id="phaser-container"
          className="w-[800px] h-[600px]"
        />
      )}
    </ClientOnly>
  );
}
