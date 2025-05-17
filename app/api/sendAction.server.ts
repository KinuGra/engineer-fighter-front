type Message = {
	id: string;
	angle: number[];
	pull_power: number;
};

export type SendActionRequest = {
	type: "action";
	message: Message;
};

const sendAction = async (
	request: SendActionRequest,
	apiUrl: string,
	roomId: string,
) => {
	const response = await fetch(`${apiUrl}/rooms/${roomId}/action`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		throw new Error("Failed to send action");
	}

	return {};
};

export default sendAction;
