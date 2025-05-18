import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useAtomValue } from "jotai";
import { githubUserAtom } from "~/atoms/githubUser";
import { playersAtom } from "~/atoms/players";
import PhaserGame from "~/features/game/components/PhaserGame";
import { getGameSettings } from "~/features/game/loader";

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
	const { apiUrl, gameSettings } = useLoaderData<typeof loader>();
	const roomId = new URLSearchParams(window.location.search).get("roomId");
	const mainPlayerId = useAtomValue(githubUserAtom)?.login;

	if(!roomId) {
		throw new Error("Room ID is required");
	}

	const players = useAtomValue(playersAtom);

	return (
		<div className="flex flex-col items-center p-4">
			<h1 className="text-2xl font-bold mb-4">ゲーム画面</h1>
			<div className="bg-slate-100 border border-slate-300 rounded shadow-md p-2">
				<PhaserGame
					gameSettings={gameSettings}
					players={players}
					mainPlayerId={mainPlayerId}
					apiUrl={apiUrl}
					roomId={roomId}
				/>
			</div>
			<div className="mt-4 text-sm text-gray-600">
				<p>プレイヤーをドラッグして移動させましょう</p>
				<p>他のプレイヤーにぶつけて場外に追い出しましょう</p>
			</div>
		</div>
	);
}
