import { Player } from "../objects/player";
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
    // physics: {
    //   default: 'arcade',
    //   arcade: {
    //     gravity: gameSettings.physics.gravity,
    //     debug: gameSettings.physics.debug
    //   }
    // },
    scene: {
      preload: function (this: Phaser.Scene) {
        this.load.setBaseURL(gameSettings.assets.baseUrl);
        gameSettings.assets.images.forEach(img => {
          this.load.image(img.key, img.path);
        });
      },
      create: function (this: Phaser.Scene) {
        this.cameras.main.setBackgroundColor("#BBFBFF");
        const field = this.add.rectangle(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          600,
          400,
          0x00ff00
        );
        field.setOrigin(0.5, 0.5);

        // プレイヤーを赤い円として描画
        import("../objects/player").then(({ Player }) => {
          const player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            30, // 半径
            'player1',
            '',
            50, // power
            50, // weight
            50, // volume
            500 // cooldown
          );
        })
      },
      update: function (this: Phaser.Scene) {

      }
    }
  };
};

