import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import * as pkg from "react-loader-spinner";
const { Grid } = pkg;
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import StartButton from "~/components/StartButton";
import genPoint from "~/utils/genPoint.client";
import { useAtomValue } from "jotai";
import { githubUserAtom } from "~/atoms/githubUser";

type Player = {
	id: string;
	iconUrl: string;
	name?: string;
};

interface PlayerCardProps {
	player: Player;
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const websocketUrl = context.cloudflare.env.WS_URL;

	return { websocketUrl };
};

const PlayerCard = (props: PlayerCardProps) => {
	return (
		<div style={styles.card}>
			<div style={styles.iconContainer}>
				<img
					src={props.player.iconUrl}
					alt={`Icon for player ${props.player.id}`}
					style={styles.icon}
				/>
			</div>
			<div style={styles.idContainer}>
				<div>
					{props.player.name && (
						<div style={styles.name}>{props.player.name}</div>
					)}
					<span style={styles.id}>@{props.player.id}</span>
				</div>
			</div>
		</div>
	);
};

const styles = {
	card: {
		display: "flex",
		flexDirection: "row" as const,
		alignItems: "center" as const,
		border: "1px solid #ccc",
		borderRadius: "5px",
		padding: "10px",
		margin: "5px",
		width: "300px",
	},
	idContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "80%",
		height: "100%",
	},
	id: {
		fontSize: "0.9em",
		color: "#666",
	},
	name: {
		fontSize: "1em",
		fontWeight: "bold" as const,
		marginBottom: "2px",
	},
	iconContainer: {
		width: "50px",
		height: "50px",
		borderRadius: "50%",
		overflow: "hidden" as const,
	},
	icon: {
		width: "100%",
		height: "100%",
		objectFit: "cover" as const,
	},
};

const WaitingRoom = () => {
	const { websocketUrl } = useLoaderData<typeof loader>();
	const socketRef = useRef<WebSocket | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);
	const githubUser = useAtomValue(githubUserAtom);

	useEffect(() => {
		const { x, y } = genPoint();

		// GitHubの情報をもとに計算する
		const power = 2;
		const weight = 1;
		const volume = 5;
		const cd = 7;
		
		// GitHubユーザー情報を使用する
		const userID = githubUser?.login || "guest";
		const iconUrl = githubUser?.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
		const roomID = "821047cb-f394-41d3-a928-71ea2567c960";

		const params = new URLSearchParams({
			roomID,
			userID,
			iconUrl,
			power: power.toString(),
			weight: weight.toString(),
			volume: volume.toString(),
			cd: cd.toString(),
			x: x.toString(),
			y: y.toString(),
		});

		const ws = new WebSocket(`${websocketUrl}?${params.toString()}`);
		socketRef.current = ws;

		ws.onopen = () => {
			console.log("WebSocket connected");
			setPlayers((prevPlayers) => [...prevPlayers, { id: userID, iconUrl }]);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "join") {
				setPlayers((prevPlayers) => [
					...prevPlayers,
					{ 
						id: data.message.id, 
						iconUrl: data.message.icon_url, 
					},
				]);
			} else if (data.type === "leave") {
				setPlayers((prevPlayers) =>
					prevPlayers.filter((player) => player.id !== data.message.id),
				);
			} else if (data.type === "start") {
				console.log("Game started");
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		ws.onclose = (event) => {
			console.warn("WebSocket closed", {
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean,
			});
		};

		return () => {
			ws.close();
		};
	}, [websocketUrl, githubUser]);

	return (
		<ClientOnly>
			{() => (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						marginTop: "80px",
					}}
				>
					<Grid
						height="50"
						width="50"
						color="#4fa94d"
						ariaLabel="audio-loading"
						wrapperStyle={{}}
						wrapperClass="wrapper-class"
						visible={true}
					/>
					<div
						style={{
							marginTop: "24px",
							marginBottom: "24px",
							color: "#666",
							fontSize: "18px",
						}}
					>
						しばらくお待ちください...
					</div>
					<div>
						<div>
							{players.map((player: Player) => (
								<PlayerCard key={player.id} player={player} />
							))}
						</div>
					</div>
					<div style={{ marginTop: "24px" }}>
						<StartButton />
					</div>
				</div>
			)}
		</ClientOnly>
	);
};

export default WaitingRoom;
