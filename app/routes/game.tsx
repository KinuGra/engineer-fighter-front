import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import PhaserGame from "~/features/game/components/PhaserGame";
import { getGameSettings } from "~/features/game/loader";

const samplePlayers = [
  {
    id: "player1",
    icon: "",
    power: 70,
    weight: 50,
    volume: 60,
    cd: 500,
  },
  {
    id: "enemy1",
    icon: "",
    power: 50,
    weight: 60,
    volume: 40,
    cd: 400,
  },
  {
    id: "enemy2",
    icon: "",
    power: 40,
    weight: 30,
    volume: 80,
    cd: 300,
  },
  {
    id: "enemy3",
    icon: "",
    power: 80,
    weight: 80,
    volume: 30,
    cd: 600,
  },
];

export const loader = getGameSettings;
export const meta: MetaFunction = () => {
  return [
    { title: "ゲーム画面" },
    { name: "description", content: "対戦ゲーム画面" },
  ];
};

/**
 * ゲームプレイ画面コンポーネント
 * PhaserGameコンポーネントを使用してゲーム機能を表示します
 */
export default function GameScreen() {
  const { gameSettings } = useLoaderData<typeof loader>();
  
  // メインプレイヤーのIDを設定
  const mainPlayerId = "player1";

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">ゲーム画面</h1>
      <div className="bg-slate-100 border border-slate-300 rounded shadow-md p-2">
        <PhaserGame
          gameSettings={gameSettings}
          players={samplePlayers}
          mainPlayerId={mainPlayerId}
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>プレイヤーをドラッグして移動させましょう</p>
        <p>他のプレイヤーにぶつけて場外に追い出しましょう</p>
      </div>
    </div>
  );
}