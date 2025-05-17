import startGame from "~/api/startGame.client";

interface StartButtonProps {
	roomId: string;
	apiUrl: string;
}

export const startGameHandler = async (apiUrl: string, roomID: string) => {
	await startGame(apiUrl, roomID);
};

const StartButton = (props: StartButtonProps) => {
	return (
		<button
			className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
			type="button"
			onClick={() => startGameHandler(props.roomId, props.apiUrl)}
		>
			Start Game
		</button>
	);
};

export default StartButton;
