import type { Player } from "../objects/player";
import ClientGameStateManager from "../state/ClientGameStateManager";
import type { GameSettings } from "./gameSettings";
import { FIELD_WIDTH, FIELD_HEIGHT } from "./config";

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
	parent: HTMLElement | undefined,
): Promise<Phaser.Types.Core.GameConfig> => {
	// Phaserはクライアント側でのみインポート
	// @ts-expect-error 動的インポート(tsconfig.jsonでのmodules設定に依存)
	const Phaser = (await import("phaser")).default;

	// ゲーム開始時に状態を初期化
	stateManager.resetState();
	stateManager.setGameStatus("waiting");

	return {
		type: Phaser.AUTO,
		width: gameSettings.display.width,
		height: gameSettings.display.height,
		parent: parent || undefined,
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
			create: async function (this: Phaser.Scene) {
				this.cameras.main.setBackgroundColor("#BBFBFF");

				// 物理世界の境界をフィールドサイズに一致させる（重要）
				this.physics.world.setBounds(
					this.cameras.main.centerX - FIELD_WIDTH / 2,
					this.cameras.main.centerY - FIELD_HEIGHT / 2,
					FIELD_WIDTH,
					FIELD_HEIGHT,
				);

				// 物理境界のデバッグ出力
				console.log("Physics World Bounds:", this.physics.world.bounds);

				// 緑のフィールドを作成
				const field = this.add.rectangle(
					this.cameras.main.centerX,
					this.cameras.main.centerY,
					FIELD_WIDTH,
					FIELD_HEIGHT,
					0x00ff00,
				);
				field.setOrigin(0.5, 0.5);

				// フィールドの境界線を作成
				const fieldBorder = this.add.graphics();
				fieldBorder.lineStyle(5, 0x00ee00, 1);
				fieldBorder.strokeRect(
					this.cameras.main.centerX - FIELD_WIDTH / 2,
					this.cameras.main.centerY - FIELD_HEIGHT / 2,
					FIELD_WIDTH,
					FIELD_HEIGHT,
				);

				try {
					// Playerクラスを動的にインポート
					// @ts-expect-error 動的インポート(tsconfig.jsonでのmodules設定に依存)
					const { Player } = await import("../objects/player");
					const players = [];

					// メインプレイヤーを赤い円として描画
					// TODO: プレイヤーステータスを反映（とりあえず player1 で）
					// TODO: 自分のプレイヤーアイコンのみをハイライトするようにする
					const player = new Player(
						this,
						this.cameras.main.centerX,
						this.cameras.main.centerY,
						20, // 半径
						"player1",
						"",
						50, // power
						50, // weight
						50, // volume
						500, // cooldown
					);

					// メインプレイヤーを配列に追加
					players.push(player);

					// 適当な敵プレイヤーを作成
					// TODO: プレイヤーを追加する処理を実装
					for (let i = 0; i < 5; i++) {
						const enemyPlayer = new Player(
							this,
							Phaser.Math.Between(0, FIELD_WIDTH),
							Phaser.Math.Between(0, FIELD_WIDTH),
							20, // 半径
							`enemy${i}`,
							"",
							Phaser.Math.Between(10, 100), // power
							Phaser.Math.Between(10, 100), // weight
							Phaser.Math.Between(10, 100), // volume
							500, // cooldown
						);

						enemyPlayer.setFillStyle(0xffffff, 1);

						// 敵プレイヤーを配列に追加
						players.push(enemyPlayer);
					}

					// プレイヤー配列をシーンのデータとして保存（update内で使用するため）
					this.data.set("playerObjects", players);

					// プレイヤー同士の衝突を設定
					this.physics.add.collider(players, players, (obj1, obj2) => {
						const p1 = obj1 as unknown as Player;
						const p2 = obj2 as unknown as Player;

						if (p1.id && p2.id) {
							// プレイヤー同士の衝突をコンソールに出力（デバッグ用）
							console.log(`${p1.id} collided with ${p2.id}`);

							// 衝突時のエネルギー転移処理
							const impact1to2 = p1.applyCollisionImpactTo(p2);

							if (impact1to2 > 0) {
								// 衝突が有効だった場合のログ（デバッグ用）
								console.log(`Impact force: ${p1.id}->${p2.id}: ${impact1to2}`);
							}
						}
					});

					// 画面クリック時の処理を設定
					let isFirstClick = true;
					this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
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

				stateManager.setGameStatus("playing");
			},
			update: function (this: Phaser.Scene) {
				const statusTextKey = "gameStatusText";
				const status = stateManager.getState().gameStatus;

				let statusText = this.children.getByName(
					statusTextKey,
				) as Phaser.GameObjects.Text | null;
				if (!statusText) {
					statusText = this.add
						.text(0, 0, `status: ${status}`, {
							font: "15px",
							color: "#222",
							padding: { left: 8, right: 8, top: 4, bottom: 4 },
						})
						.setOrigin(0, 0)
						.setName(statusTextKey)
						.setDepth(1000);
				} else {
					statusText.setText(`status: ${status}`);
				}

				// 保存されたプレイヤーオブジェクトを取得
				const players = this.data.get("playerObjects");

				// プレイヤーごとの更新処理
				if (players && Array.isArray(players)) {
					for (const player of players) {
						if (player && typeof player.update === "function") {
							// プレイヤーのアップデート関数を呼び出し
							player.update();
							console.log(
								`Updating player ${player.id} at (${player.x}, ${player.y})`,
							);
						}
					}
				}
			},
		},
	};
};
