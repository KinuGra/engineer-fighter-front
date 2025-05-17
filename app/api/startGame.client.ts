type StartGameRequest = {
	type: "start";
};

type StartGameResponse = Record<string, never>;

const startGame = async (
	roomId: string,
	apiUrl: string,
): Promise<StartGameResponse> => {
	const response = await fetch(`${apiUrl}/rooms/${roomId}/start`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ type: "start" } as StartGameRequest),
	});

	if (!response.ok) {
		throw new Error("Failed to start game");
	}

	return {}
};

export default startGame;
