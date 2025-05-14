import { GameObjects } from 'phaser';

/**
 * Phaserゲーム内のプレイヤーオブジェクトクラス
 * ゲーム内でのプレイヤーの振る舞いや状態を管理する
 */
export class Player extends GameObjects.Arc {
  /** ユーザーID */
  public id: string;
  /** ユーザーアイコンURL (= GitHub のアイコンurl) */
  public icon: string;
  /** パワー値 (1-100) */
  public power: number;
  /** 重さ (1-100) */
  public weight: number;
  /** 体積 (1-100) */
  public volume: number;
  /** クールダウン時間 (1-1000ms) */
  public cd: number;
  
  /** プレイヤーが現在クールダウン中かどうか */
  private isCooldown: boolean = false;
  /** プレイヤーの現在の速度 */
  private moveSpeed: number = 0;

  /**
   * プレイヤーオブジェクトのコンストラクタ
   * 
   * @param scene プレイヤーが配置されるシーン
   * @param x プレイヤーの初期X座標
   * @param y プレイヤーの初期Y座標
   * @param texture プレイヤーのテクスチャキー
   * @param id ユーザーID
   * @param icon ユーザーアイコンURL
   * @param power パワー値 (1-100)
   * @param weight 重さ (1-100)
   * @param volume 体積 (1-100)
   * @param cd クールダウン時間 (1-1000ms)
   */
  /**
   * プレイヤーオブジェクトのコンストラクタ
   * 
   * @param scene プレイヤーが配置されるシーン
   * @param x プレイヤーの初期X座標
   * @param y プレイヤーの初期Y座標
   * @param radius プレイヤーの円の半径
   * @param id ユーザーID
   * @param icon ユーザーアイコンURL
   * @param power パワー値 (1-100)
   * @param weight 重さ (1-100)
   * @param volume 体積 (1-100)
   * @param cd クールダウン時間 (1-1000ms)
   */
  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    radius: number,
    id: string,
    icon: string,
    power: number,
    weight: number,
    volume: number,
    cd: number
  ) {
    // 赤い円としてプレイヤーを作成
    super(scene, x, y, radius, 0, 360, false, 0xFF0000);
    
    // シーンに追加
    scene.add.existing(this);
    
    // 物理演算を有効化
    if (scene.physics && scene.physics.add) {
      scene.physics.add.existing(this);
      
      // 物理ボディがあれば円形に設定
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body) {
        body.setCircle(radius);
      }
    }
    
    // ユーザー情報を保存
    this.id = id;
    this.icon = icon;
    this.power = power;
    this.weight = weight;
    this.volume = volume;
    this.cd = cd;
  }

}