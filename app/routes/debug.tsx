import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import PhaserGame from "~/features/game/components/PhaserGame";
import { getGameSettings } from "~/features/game/loader";

const samplePlayers = [
	{
		id: "ulxsth",
		icon: "https://avatars.githubusercontent.com/u/114195789?v=4",
		power: 70,
		weight: 50,
		volume: 60,
		cd: 500,
	},
	{
		id: "ogatakatsuya",
		icon: "https://avatars.githubusercontent.com/u/130939004?v=4",
		power: 50,
		weight: 60,
		volume: 40,
		cd: 400,
	},
	{
		id: "zatunohito",
		icon: "https://avatars.githubusercontent.com/u/166904542?v=4",
		power: 40,
		weight: 30,
		volume: 80,
		cd: 300,
	},
	{
		id: "KinuGra",
		icon: "https://avatars.githubusercontent.com/u/197525874?v=4",
		power: 80,
		weight: 80,
		volume: 30,
		cd: 600,
	},
];

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

	// メインプレイヤーのIDを設定
	const mainPlayerId = "ulxsth";

	return (
		<div className="flex flex-col items-center p-4">
			<h1 className="text-2xl font-bold mb-4">Phaser デバッグページ</h1>
			<div className="bg-slate-100 border border-slate-300 rounded shadow-md p-2">
				<PhaserGame
					gameSettings={gameSettingsCopy}
					players={samplePlayers}
					mainPlayerId={mainPlayerId}
				/>
			</div>
			<div className="mt-4 text-sm text-gray-600">
				<p>このページはPhaserのデバッグ用に設計されています</p>
				<p>物理エンジンのデバッグモードが有効になっています</p>
			</div>
		</div>
	);
}
