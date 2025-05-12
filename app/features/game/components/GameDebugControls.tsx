import { useState, useEffect } from "react";
import type { GameSettings } from "../config/gameSettings";

interface GameDebugControlsProps {
  gameSettings: GameSettings;
  onSettingsChange: (newSettings: GameSettings) => void;
}

/**
 * ゲームのデバッグ設定を制御するコンポーネント
 */
export default function GameDebugControls({ gameSettings, onSettingsChange }: GameDebugControlsProps) {
  const [settings, setSettings] = useState(gameSettings);

  useEffect(() => {
    setSettings(gameSettings);
  }, [gameSettings]);

  const handleChange = (settingPath: string, value: boolean) => {
    const newSettings = JSON.parse(JSON.stringify(settings));
    
    // ネストされたパスを処理（例: debug.showBody）
    const parts = settingPath.split('.');
    let current = newSettings;
    
    // 最後の要素以外を辿る
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    
    // 最後の要素を更新
    current[parts[parts.length - 1]] = value;
    
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">デバッグ設定</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="physics-debug"
            checked={settings.physics.debug}
            onChange={(e) => handleChange('physics.debug', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="physics-debug">物理エンジンデバッグモード</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="debug-show-body"
            checked={settings.debug.showBody}
            onChange={(e) => handleChange('debug.showBody', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="debug-show-body">ボディ表示</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="debug-show-velocity"
            checked={settings.debug.showVelocity}
            onChange={(e) => handleChange('debug.showVelocity', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="debug-show-velocity">速度ベクトル表示</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="debug-show-collision"
            checked={settings.debug.showCollision}
            onChange={(e) => handleChange('debug.showCollision', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="debug-show-collision">コリジョン表示</label>
        </div>
      </div>
    </div>
  );
}
