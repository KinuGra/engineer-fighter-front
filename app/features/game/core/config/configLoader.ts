import type { GameSettings } from "./gameSettings";

/**
 * Phaserゲーム設定を生成する関数。
 * **必ずクライアントサイド（useEffect内）で呼び出す** こと！！
 * 
 * @param gameSettings ゲーム設定
 * @param parent コンテナ要素
 * @returns Phaser.Types.Core.GameConfig
 */
export const createGameConfig = async (
  gameSettings: GameSettings,
  parent: HTMLElement | undefined
): Promise<Phaser.Types.Core.GameConfig> => {
  // Phaserはクライアント側でのみインポート
  // @ts-expect-error 動的インポート(tsconfig.jsonでのmodules設定に依存)
  const Phaser = (await import("phaser")).default;

  return {
    type: Phaser.AUTO,
    width: gameSettings.display.width,
    height: gameSettings.display.height,
    parent: parent || undefined,
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
};
