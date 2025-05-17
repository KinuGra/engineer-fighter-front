export type User = {
  userId: string;
  iconUrl: string;
  cd: number;
  power: number;
  weight: number;
  volume: number;
  point: number[];
};

export type GetUsersResponse = {
  users: User[];
};

export const getUsers = async (
  roomId: string,
  apiUrl: string,
): Promise<GetUsersResponse> => {
  const response = await fetch(`${apiUrl}/rooms/${roomId}/join`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: GetUsersResponse = await response.json();
  return data;
};
