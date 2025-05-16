import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import PhaserGame from "~/features/game/components/PhaserGame";
import { getGameSettings } from "~/features/game/loader";

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
	
	const samplePlayers = [
		{
			id: 'player1',
			icon: '',
			power: 70,  
			weight: 50, 
			volume: 60, 
			cd: 500,    
		},
		{
			id: 'enemy1',
			icon: '',
			power: 50,
			weight: 60,
			volume: 40,
			cd: 400,
		},
		{
			id: 'enemy2',
			icon: '',
			power: 40,
			weight: 30,
			volume: 80,
			cd: 300,
		},
		{
			id: 'enemy3',
			icon: '',
			power: 80,
			weight: 80,
			volume: 30,
			cd: 600,
		},
	];
	
	// メインプレイヤーのIDを設定
	const mainPlayerId = 'player1';

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
