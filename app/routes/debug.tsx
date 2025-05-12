import { type MetaFunction } from "@remix-run/cloudflare";
import { useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Phaser Debug" },
    { name: "description", content: "Phaser Debug Page" },
  ];
};

/**
 * Phaserのデバッグページコンポーネント
 * クライアントサイドでのみPhaserを読み込み、初期化します
 */
export default function Debug() {
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
        const Phaser = (await import("phaser")).default;
        if (!containerRef.current || containerRef.current.querySelector('canvas')) {
          return;
        }

        // ゲーム設定
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: 800,
          height: 600,
          parent: containerRef.current || undefined,
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { y: 200, x: 0 },
              debug: true // デバッグモード有効
            }
          },
          scene: {
            preload: function(this: Phaser.Scene) {
              // アセットのベースURLを設定
              this.load.setBaseURL('https://labs.phaser.io');
              // アセットの読み込み
              this.load.image('sky', 'assets/skies/space3.png');
              this.load.image('logo', 'assets/sprites/phaser3-logo.png');
              this.load.image('red', 'assets/particles/red.png');
            },
            create: function(this: Phaser.Scene) {
              // 背景画像を追加
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
  }, []);

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
