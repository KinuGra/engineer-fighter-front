import type { GameSettings } from "./gameSettings";
import ClientGameStateManager from "../state/ClientGameStateManager";
// Player と Phaser は動的インポートで対応するため、ここではインポートしない

// Playerの型定義だけをインポート
import type { Player } from "../objects/player";

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
  
  // ゲーム開始時に状態を初期化
  ClientGameStateManager.getInstance().resetState();
  ClientGameStateManager.getInstance().setGameStatus('playing');

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
      create: async function (this: Phaser.Scene) {
        this.cameras.main.setBackgroundColor("#BBFBFF");
        const field = this.add.rectangle(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          600,
          400,
          0x00ff00
        );
        field.setOrigin(0.5, 0.5);
        try {
          // Playerクラスを動的にインポート
          const { Player } = await import("../objects/player");
          
          // プレイヤーを赤い円として描画
          // TODO: プレイヤーステータスを反映（とりあえず player1 で）
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
        } catch (error) {
          console.error("Failed to load Player:", error);
        }
      },
      update: function (this: Phaser.Scene) {
        
      }
    }
  };
};

