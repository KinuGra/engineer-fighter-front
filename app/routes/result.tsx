import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useClientGameState } from "~/features/game/hooks/useClientGameState";

// 型定義
interface Results {
	rank: number;
	name: string;
	username: string;
	score: number;
}

const mockResults: Results[] = [
	{ rank: 1, name: "ホストユーザー", username: "@host_user", score: 250 },
	{ rank: 2, name: "ユーザー1", username: "@user1", score: 180 },
	{ rank: 3, name: "ユーザー2", username: "@user2", score: 120 },
];

export default function Result() {
	const navigate = useNavigate();
	const { gameState } = useClientGameState();
	const [winnerName, setWinnerName] = useState("勝者");
	const [results, setResults] = useState<Results[]>([]);

	// 勝者情報と結果を取得
	useEffect(() => {
		if (gameState.eliminationOrder && gameState.eliminationOrder.length > 0) {
			// 新しい結果配列を作成
			const newResults: Results[] = [];

			// 脱落順序から順位を計算（逆順で評価）
			// eliminationOrderの最初は勝者（1位）、以降は脱落順
			gameState.eliminationOrder.forEach((playerId, index) => {
				const player = gameState.players[playerId];
				const playerName = player?.id || `プレイヤー${index + 1}`;

				// スコアは単純に順位に応じて設定
				const score = (gameState.eliminationOrder.length - index) * 100;

				newResults.push({
					rank: index + 1,
					name: playerName,
					username: `@${playerName.toLowerCase().replace(/\s/g, "_")}`,
					score: score,
				});
			});

			setResults(newResults);

			// 勝者名も設定
			if (gameState.winner) {
				const winner = gameState.players[gameState.winner];
				if (winner) {
					setWinnerName(winner.id);
				}
			}
		}
	}, [gameState]);

	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
			<h1 className="text-3xl font-bold mb-2">ゲーム結果</h1>
			<p className="mb-6 text-gray-500">
				お疲れ様でした！最終結果は以下の通りです
			</p>
			<div className="flex flex-col items-center mb-8">
				<svg
					width="64"
					height="64"
					fill="none"
					viewBox="0 0 24 24"
					className="mb-2 text-yellow-400"
				>
					<path
						fill="currentColor"
						d="M12 2a1 1 0 0 1 1 1v2.09A7.001 7.001 0 0 1 19 12a7 7 0 0 1-6 6.93V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.07A7.001 7.001 0 0 1 5 12a7 7 0 0 1 6-6.91V3a1 1 0 0 1 1-1z"
					/>
				</svg>
				<h2 className="text-xl font-bold mb-1">{winnerName}の勝利！</h2>
				<p className="text-gray-500">おめでとうございます！</p>
			</div>
			<div className="w-full max-w-md bg-gray-50 rounded-lg shadow p-4 mb-8">
				<h3 className="text-lg font-semibold mb-4">最終スコア</h3>
				<div className="flex flex-col gap-3">
					{results.length > 0
						? results.map((user) => (
								<div
									key={user.rank}
									className={`flex items-center justify-between rounded-lg px-4 py-3 ${user.rank === 1 ? "bg-yellow-50" : "bg-white"}`}
								>
									<div className="flex items-center gap-3">
										<span
											className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-white ${user.rank === 1 ? "bg-yellow-400" : user.rank === 2 ? "bg-gray-300" : "bg-yellow-200 text-gray-700"}`}
										>
											{user.rank}
										</span>
										<div>
											<div className="font-semibold">{user.name}</div>
											<div className="text-xs text-gray-400">
												{user.username}
											</div>
										</div>
									</div>
									<span className="text-lg font-bold">{user.score}点</span>
								</div>
							))
						: // 結果がない場合はモックデータを表示
							mockResults.map((user) => (
								<div
									key={user.rank}
									className={`flex items-center justify-between rounded-lg px-4 py-3 ${user.rank === 1 ? "bg-yellow-50" : "bg-white"}`}
								>
									<div className="flex items-center gap-3">
										<span
											className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-white ${user.rank === 1 ? "bg-yellow-400" : user.rank === 2 ? "bg-gray-300" : "bg-yellow-200 text-gray-700"}`}
										>
											{user.rank}
										</span>
										<div>
											<div className="font-semibold">{user.name}</div>
											<div className="text-xs text-gray-400">
												{user.username}
											</div>
										</div>
									</div>
									<span className="text-lg font-bold">{user.score}点</span>
								</div>
							))}
				</div>
			</div>
			<div className="flex gap-4 w-full max-w-md">
				<button
					className="flex-1 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-semibold"
					onClick={() => {
						navigate("/home");
					}}
				>
					ホームに戻る
				</button>
				<button
					className="flex-1 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800"
					onClick={() => {
						navigate("/waiting");
					}}
				>
					もう一度プレイ
				</button>
			</div>
		</div>
	);
}
