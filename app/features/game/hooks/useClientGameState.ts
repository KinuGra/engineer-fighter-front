import { useEffect, useState } from "react";
import ClientGameStateManager, {
	type GameState,
	type PlayerState,
} from "../core/state/ClientGameStateManager";

/**
 * クライアントサイドのゲーム状態を利用するためのカスタムフック
 */
export function useClientGameState() {
	const [gameState, setGameState] = useState<GameState>(
		ClientGameStateManager.getInstance().getState(),
	);

	useEffect(() => {
		const gameStateManager = ClientGameStateManager.getInstance();

		const handleEvent = () => {
			setGameState({ ...gameStateManager.getState() });
		};

		gameStateManager.addEventListener(handleEvent);

		return () => {
			gameStateManager.removeEventListener(handleEvent);
		};
	}, []);

	// サーバーサイドレンダリング時は空のオブジェクトを返す
	if (typeof window === "undefined") {
		return {
			gameState: {
				players: {},
				gameStatus: "waiting",
				winner: undefined,
			} as GameState,
			addPlayer: () => {},
			updatePlayer: () => {},
			removePlayer: () => {},
			setGameStatus: () => {},
			setWinner: () => {},
			resetState: () => {},
		};
	}

	return {
		gameState,
		addPlayer: (player: PlayerState) =>
			ClientGameStateManager.getInstance().addPlayer(player),
		updatePlayer: (playerId: string, updates: Partial<PlayerState>) =>
			ClientGameStateManager.getInstance().updatePlayer(playerId, updates),
		removePlayer: (playerId: string) =>
			ClientGameStateManager.getInstance().removePlayer(playerId),
		setGameStatus: (status: "waiting" | "playing" | "finished") =>
			ClientGameStateManager.getInstance().setGameStatus(status),
		setWinner: (winnerId: string) =>
			ClientGameStateManager.getInstance().setWinner(winnerId),
		resetState: () => ClientGameStateManager.getInstance().resetState(),
	};
}
