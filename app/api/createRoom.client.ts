export type CreateRoomRequest = {
    host_id: string;
    name: string;
    capacity: number;
}

export type CreateRoomResponse = {
    room_id: string;
    host_id: string;
}

export const createRoom = async (request: CreateRoomRequest, apiUrl: string): Promise<CreateRoomResponse> => {
    const response = await fetch(`${apiUrl}/rooms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to create room');
    }

    const data: CreateRoomResponse = await response.json();
    return data;
}