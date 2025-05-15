import ClientGameStateManager from "../state/ClientGameStateManager";
import type { GameSettings } from "./gameSettings";

const stateManager = ClientGameStateManager.getInstance();

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
  stateManager.resetState();
  stateManager.setGameStatus('waiting');

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
      preload: function (this: Phaser.Scene) {
        this.load.setBaseURL(gameSettings.assets.baseUrl);
        gameSettings.assets.images.forEach(img => {
          this.load.image(img.key, img.path);
        });
      },
      create: async function (this: Phaser.Scene) {
        this.cameras.main.setBackgroundColor("#BBFBFF");

        // フィールドの寸法
        const fieldWidth = 600;
        const fieldHeight = 400;

        // 緑のフィールドを作成
        const field = this.add.rectangle(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          fieldWidth,
          fieldHeight,
          0x00ff00
        );
        field.setOrigin(0.5, 0.5);

        // フィールドの境界線を作成
        const fieldBorder = this.add.graphics();
        fieldBorder.lineStyle(5, 0x00ee00, 1);
        fieldBorder.strokeRect(
          this.cameras.main.centerX - fieldWidth / 2,
          this.cameras.main.centerY - fieldHeight / 2,
          fieldWidth,
          fieldHeight
        );

        try {
          // Playerクラスを動的にインポート
          // @ts-expect-error 動的インポート(tsconfig.jsonでのmodules設定に依存)
          const { Player } = await import("../objects/player");

          // プレイヤーを赤い円として描画
          // TODO: プレイヤーステータスを反映（とりあえず player1 で）
          // TODO: 自分のプレイヤーアイコンのみをハイライトするようにする
          const player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            20, // 半径
            'player1',
            '',
            50, // power
            50, // weight
            50, // volume
            500 // cooldown
          );

          // 適当な敵プレイヤーを作成
          // TODO: プレイヤーを追加する処理を実装
          for (let i = 0; i < 5; i++) {
            new Player(
              this,
              Math.random() * fieldWidth + 100,
              Math.random() * fieldHeight + 100,
              20, // 半径
              `enemy${i}`,
              '',
              50, // power
              50, // weight
              50, // volume
              500 // cooldown
            );
          }

          // 画面クリック時の処理を設定
          let isFirstClick = true;
          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (isFirstClick) {
              // 1回目のクリック：ひっぱりを開始
              player.startDrag(pointer.x, pointer.y);
              isFirstClick = false;
            } else {
              // 2回目のクリック：ひっぱりを完了して移動
              const didMove = player.completeDrag(pointer.x, pointer.y);
              isFirstClick = true; // 次回のクリックに備えてリセット

              if (!didMove) {
                // 移動できなかった場合は直接新しいドラッグを開始
                player.startDrag(pointer.x, pointer.y);
                isFirstClick = false;
              }
            }
          });

        } catch (error) {
          console.error("Failed to load Player:", error);
        }

        stateManager.setGameStatus('playing');
      },
      update: function (this: Phaser.Scene) {
        const statusTextKey = 'gameStatusText';
        const status = stateManager.getState().gameStatus;
        
        let statusText = this.children.getByName(statusTextKey) as Phaser.GameObjects.Text | null;
        if (!statusText) {
          statusText = this.add.text(0, 0, `status: ${status}`, {
            font: '15px',
            color: '#222',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
          }).setOrigin(0, 0).setName(statusTextKey).setDepth(1000);
        } else {
          statusText.setText(`status: ${status}`);
        }
      }
    }
  };
};

