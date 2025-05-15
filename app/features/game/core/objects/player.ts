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
  private cooldownTimer: Phaser.Time.TimerEvent | null = null;
  
  // ひっぱり用の変数
  private dragStartPoint: Phaser.Math.Vector2 | null = null;


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

    // ユーザー情報を保存
    this.id = id;
    this.icon = icon;
    this.power = power;
    this.weight = weight;
    this.volume = volume;
    this.cd = cd;

    // 物理演算を有効化
    if (scene.physics && scene.physics.add) {
      scene.physics.add.existing(this);

      // 物理ボディがあれば円形に設定
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body) {
        body.setCircle(radius);
        
        // 境界との衝突を有効化
        body.setCollideWorldBounds(true);
        
        // 初期設定（質量と摩擦係数）
        const weightFactor = this.weight / 100;
        const volumeFactor = this.volume / 100;
        const mass = 1 + weightFactor * 4;
        const frictionFactor = (1 - weightFactor) * 0.7 + volumeFactor * 0.3;
        const dragCoefficient = 0.05 + frictionFactor * 0.15;
        
        body.setMass(mass);
        body.setDamping(true);
        body.setDrag(dragCoefficient);
        body.setBounce(0.3 - weightFactor * 0.2);
      }
    }

    // グローバルなゲーム状態に登録
    ClientGameStateManager.getInstance().addPlayer({
      id: this.id,
      icon: this.icon,
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

  /**
   * クールダウン中かどうかを確認する
   * @returns クールダウン中ならtrue、そうでなければfalse
   */
  public isInCooldown(): boolean {
    return this.isCooldown;
  }

  /**
   * ひっぱり開始のポイントを設定する（一度目のクリック）
   * @param x ひっぱり開始地点のX座標
   * @param y ひっぱり開始地点のY座標
   */
  public startDrag(x: number, y: number): void {
    if (this.isInCooldown()) return;

    console.log('Drag started at:', x, y);
    this.dragStartPoint = new Phaser.Math.Vector2(x, y);
  }

  /**
   * ひっぱりを完了し、プレイヤーを移動させる（二度目のクリック）
   * @param x ひっぱり終了地点のX座標
   * @param y ひっぱり終了地点のY座標
   * @returns 移動が実行されたかどうか
   */
  public completeDrag(x: number, y: number): boolean {
    if (this.isInCooldown() || !this.dragStartPoint) return false;

    // ドラッグの終点を作成
    const dragEndPoint = new Phaser.Math.Vector2(x, y);
    
    // ドラッグのベクトルを計算（始点から終点へのベクトル）
    const dragVector = new Phaser.Math.Vector2(
      this.dragStartPoint.x - dragEndPoint.x,
      this.dragStartPoint.y - dragEndPoint.y
    );
    
    // ドラッグの距離（強さ）を計算
    const dragDistance = dragVector.length();
    
    // 最大強度を設定（強すぎると画面外に飛んでいくのを防止）
    const maxStrength = 500;
    const normalizedStrength = Math.min(dragDistance, maxStrength);
    
    // パワー値に基づいて強さを調整
    const powerFactor = this.power / 50; // パワーが50の時に1倍
    const finalStrength = normalizedStrength * powerFactor;
    
    // 移動方向の角度を計算
    const angle = dragVector.angle();
    
    // ベクトルを正規化して強さを適用
    const velocityX = Math.cos(angle) * finalStrength;
    const velocityY = Math.sin(angle) * finalStrength;
    
    // 物理ボディがあれば速度を設定
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) {
      // 重さに応じたパラメータ調整
      const weightFactor = this.weight / 100; // 0～1の値
      
      // 質量の設定 - 重いほど質量が大きい（慣性が大きい）
      const mass = 1 + weightFactor * 4; // 1～5の間の質量
      body.setMass(mass);
      
      // 摩擦係数の設定 - 軽いプレイヤーほど摩擦が強い（早く止まる）
      // 体積が大きい場合も表面積が広くなるので摩擦が大きい
      const volumeFactor = this.volume / 100; // 0～1の値
      const frictionFactor = (1 - weightFactor) * 0.7 + volumeFactor * 0.3;
      const dragCoefficient = 0.05 + frictionFactor * 0.15; // 0.05～0.2の間
      
      // 物理パラメータの適用
      body.setDamping(true);
      body.setDrag(dragCoefficient); 
      
      // バウンス（跳ね返り）を小さめに設定（重い方が跳ね返りが小さい）
      body.setBounce(0.3 - weightFactor * 0.2); // 0.1～0.3の間
      
      // 速度の適用
      body.setVelocity(velocityX, velocityY);
    }
    
    // クールダウンを開始
    this.startCooldown();
    
    // ドラッグ情報をリセット
    this.dragStartPoint = null;
    
    console.log('Drag completed. New velocity:', velocityX, velocityY);
    return true;
  }

  /**
   * クールダウンを開始する
   */
  private startCooldown(): void {
    this.isCooldown = true;
    
    // グローバル状態を更新
    ClientGameStateManager.getInstance().updatePlayer(this.id, {
      isActive: false
    });
    
    // 既存のタイマーがあればキャンセル
    if (this.cooldownTimer) {
      this.cooldownTimer.remove();
    }
    
    // 新しいクールダウンタイマーを設定
    this.cooldownTimer = this.scene.time.delayedCall(
      this.cd,
      () => {
        this.isCooldown = false;
        this.cooldownTimer = null;
        
        // グローバル状態を更新
        ClientGameStateManager.getInstance().updatePlayer(this.id, {
          isActive: true
        });
      }
    );
  }

  /**
   * ドラッグをキャンセルする
   */
  public cancelDrag(): void {
    this.dragStartPoint = null;
  }

}