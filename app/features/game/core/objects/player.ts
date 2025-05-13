import { Physics } from 'phaser';

/**
 * Phaserゲーム内のプレイヤーオブジェクトクラス
 * ゲーム内でのプレイヤーの振る舞いや状態を管理する
 */
export class Player extends Physics.Arcade.Sprite {
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
  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    texture: string,
    id: string,
    icon: string,
    power: number,
    weight: number,
    volume: number,
    cd: number
  ) {
    super(scene, x, y, texture);
    
    // ユーザー情報を保存
    this.id = id;
    this.icon = icon;
    this.power = power;
    this.weight = weight;
    this.volume = volume;
    this.cd = cd;
  }

}