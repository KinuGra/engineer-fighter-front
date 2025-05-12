import { type MetaFunction, data } from "@remix-run/cloudflare";
import { useEffect, useRef } from "react";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const gameSettings = {
    physics: {
      gravity: { x: 0, y: 200 },
      debug: true
    },
    display: {
      width: 800,
      height: 600
    },
    userPreferences: {
      controls: "keyboard"
    },
    // アセット情報
    assets: {
      baseUrl: "https://labs.phaser.io",
      images: [
        { key: "sky", path: "assets/skies/space3.png" },
        { key: "logo", path: "assets/sprites/phaser3-logo.png" },
        { key: "red", path: "assets/particles/red.png" }
      ]
    }
  };

  return data({ gameSettings });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Phaser Debug" },
    { name: "description", content: "Phaser Debug Page" },
  ];
};

/**
 * Phaserのデバッグページコンポーネント
 * クライアントサイドでのみPhaserを読み込み、初期化します
 * loaderから取得した設定を使用します
 */
export default function Debug() {
  const { gameSettings } = useLoaderData<typeof loader>();
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
        if (!containerRef.current || containerRef.current.querySelector('canvas')) {
          return;
        }

        // loaderから取得したゲーム設定を使用
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: gameSettings.display.width,
          height: gameSettings.display.height,
          parent: containerRef.current || undefined,
          physics: {
            default: 'arcade',
            arcade: {
              gravity: gameSettings.physics.gravity,
              debug: gameSettings.physics.debug
            }
          },
          scene: {
            preload: function(this: Phaser.Scene) {
              this.load.setBaseURL(gameSettings.assets.baseUrl);
              gameSettings.assets.images.forEach(img => {
                this.load.image(img.key, img.path);
              });
            },
            create: function(this: Phaser.Scene) {
              this.add.image(400, 300, 'sky');
              
              // パーティクルエミッターを作成
              const particles = this.add.particles(0, 0, 'red', {
                speed: 100,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD'
              });
              
              // ロゴに物理演算を適用
              const logo = this.physics.add.image(400, 100, 'logo');
              logo.setVelocity(100, 200);
              logo.setBounce(1, 1);
              logo.setCollideWorldBounds(true);
              
              // パーティクルをロゴに追従させる
              particles.startFollow(logo);
            }
          }
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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Phaser デバッグページ</h1>
      <div className="bg-slate-100 border border-slate-300 rounded shadow-md p-2">
        {/* Phaserのキャンバスが挿入されるコンテナ */}
        <div ref={containerRef} id="phaser-container" className="w-[800px] h-[600px]" />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>このページはPhaserのデバッグ用に設計されています</p>
        <p>物理エンジンのデバッグモードが有効になっています</p>
      </div>
    </div>
  );
}
