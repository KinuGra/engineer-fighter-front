import { GameObjects } from 'phaser';
import ClientGameStateManager from '../state/ClientGameStateManager';

/**
 * Phaserゲーム内のプレイヤーオブジェクトクラス
 * ゲーム内でのプレイヤーの振る舞いや状態を管理する
 */
export class Player extends GameObjects.Arc {
  public id: string;
  public icon: string;
  public power: number;
  public weight: number;
  public volume: number;
  public cd: number;
    
  private isCooldown: boolean = false;
  private moveSpeed: number = 0;

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
    
    // グローバルなゲーム状態に登録
    ClientGameStateManager.getInstance().addPlayer({
      id: this.id,
      name: this.id, // 名前がない場合はidを使用
      avatar: this.icon,
      power: this.power,
      weight: this.weight,
      volume: this.volume,
      cooldown: this.cd,
      position: { x: this.x, y: this.y },
      isActive: true
    });
    
    // プレイヤーが更新されたときにゲーム状態も更新
    this.on('destroy', () => {
      ClientGameStateManager.getInstance().removePlayer(this.id);
    });
  }
  
  /**
   * プレイヤーの位置を更新し、状態マネージャーと同期する
   * @param x X座標
   * @param y Y座標
   */
  public setPosition(x: number, y: number): this {
    super.setPosition(x, y);
    
    // グローバル状態を更新
    ClientGameStateManager.getInstance().updatePlayer(this.id, {
      position: { x, y }
    });
    
    return this;
  }
  
  /**
   * プレイヤーの状態を更新する
   * @param updates 更新するプロパティ
   */
  public updatePlayerState(updates: {
    power?: number;
    weight?: number;
    volume?: number;
    cd?: number;
    isActive?: boolean;
  }): this {
    // プロパティを更新
    if (updates.power !== undefined) this.power = updates.power;
    if (updates.weight !== undefined) this.weight = updates.weight;
    if (updates.volume !== undefined) this.volume = updates.volume;
    if (updates.cd !== undefined) this.cd = updates.cd;
    
    // グローバル状態を更新
    ClientGameStateManager.getInstance().updatePlayer(this.id, {
      power: this.power,
      weight: this.weight,
      volume: this.volume,
      cooldown: this.cd,
      isActive: updates.isActive !== undefined ? updates.isActive : true
    });
    
    return this;
  }

}