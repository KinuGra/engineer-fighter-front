export interface JoinRoomRequest {
	password: string;
}

export interface JoinRoomResponse {
	status: "ok" | "ng";
}

export const JoinRoom = async (
	request: JoinRoomRequest,
	apiUrl: string,
): Promise<JoinRoomResponse> => {
	const response = await fetch(`${apiUrl}/rooms/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		throw new Error("Failed to join room");
	}

	const data: JoinRoomResponse = await response.json();
	return data;
};
