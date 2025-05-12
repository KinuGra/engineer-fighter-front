import { type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getGameSettings } from "~/features/game/loader";
import PhaserGame from "~/features/game/components/PhaserGame";

export const loader = getGameSettings;

export const meta: MetaFunction = () => {
  return [
    { title: "Phaser Debug" },
    { name: "description", content: "Phaser Debug Page" },
  ];
};

/**
 * Phaserのデバッグページコンポーネント
 * PhaserGameコンポーネントを使用してゲーム機能を表示します
 */
export default function Debug() {
  const { gameSettings } = useLoaderData<typeof loader>();
  const gameSettingsCopy = { ...gameSettings };
  gameSettingsCopy.physics.debug = true;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Phaser デバッグページ</h1>
      <div className="bg-slate-100 border border-slate-300 rounded shadow-md p-2">
        {/* PhaserGameコンポーネントを使用 */}
        <PhaserGame gameSettings={gameSettingsCopy} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>このページはPhaserのデバッグ用に設計されています</p>
        <p>物理エンジンのデバッグモードが有効になっています</p>
      </div>
    </div>
  );
}
