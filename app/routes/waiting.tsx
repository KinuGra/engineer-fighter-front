import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import * as pkg from "react-loader-spinner";
import { ClientOnly } from "remix-utils/client-only";
import { type User, getUsers } from "~/api/getUsers.server";
import { githubGraphQLAtom, githubUserAtom } from "~/atoms/githubUser";
import { websocketAtom } from "~/atoms/socket";
import StartButton from "~/components/StartButton";
import calcStatus from "~/utils/calcStatus";
import genPoint from "~/utils/genPoint.client";
const { Grid } = pkg;
import { playersAtom } from "~/atoms/players";
import type { PlayerData } from "~/features/game/core/config/gameSettings";

interface PlayerCardProps {
	player: PlayerData;
}

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const websocketUrl = context.cloudflare.env.WS_URL;
	const apiUrl = context.cloudflare.env.API_URL;

	const url = new URL(request.url);
	const roomID = url.searchParams.get("roomId");
	if (!roomID) {
		throw new Error("Room ID is required");
	}

	const result = await getUsers(roomID, apiUrl);

	return {
		websocketUrl,
		apiUrl,
		roomID,
		users: result.users,
	};
};

const PlayerCard = (props: PlayerCardProps) => {
	return (
		<div className="flex items-center bg-slate-800/80 border border-slate-600/20 rounded-xl p-4 backdrop-blur-md shadow-md transition-transform hover:translate-y-[-2px] cursor-pointer w-full max-w-md mx-auto">
			<div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-600/20">
				<img
					src={props.player.icon}
					alt={`Icon for player ${props.player.id}`}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="flex-1 flex items-center justify-center ml-4">
				<div>
					<span className="text-lg text-slate-200 font-semibold font-mono">@{props.player.id}</span>
				</div>
			</div>
			<div className="flex gap-3">
				<div className="flex flex-col items-center gap-1">
					<span className="text-xs text-slate-400 font-mono">POW</span>
					<span className="text-sm text-slate-200 font-semibold font-mono">{props.player.power}</span>
				</div>
				<div className="flex flex-col items-center gap-1">
					<span className="text-xs text-slate-400 font-mono">WGT</span>
					<span className="text-sm text-slate-200 font-semibold font-mono">{props.player.weight}</span>
				</div>
				<div className="flex flex-col items-center gap-1">
					<span className="text-xs text-slate-400 font-mono">VOL</span>
					<span className="text-sm text-slate-200 font-semibold font-mono">{props.player.volume}</span>
				</div>
			</div>
		</div>
	);
};

const WaitingRoom = () => {
	const { websocketUrl, apiUrl, roomID, users } =
		useLoaderData<typeof loader>();
	const socketRef = useRef<WebSocket | null>(null);
	const [players, setPlayers] = useAtom<PlayerData[]>(playersAtom);
	const githubUser = useAtomValue(githubUserAtom);
	const githubStatus = useAtomValue(githubGraphQLAtom);
	const [, setWebsocket] = useAtom(websocketAtom);
	const router = useNavigate();
	const [isCopied, setIsCopied] = useState(false);
	const redirectRef = useRef(false);

	useEffect(() => {
		setPlayers(
			users.map((user: User) => ({
				id: user.userId,
				icon: user.iconUrl,
				power: user.power,
				weight: user.weight,
				volume: user.volume,
				cd: user.cd,
				x: user.point[0],
				y: user.point[1],
			})),
		);
	}, [users, setPlayers]);

	useEffect(() => {
		const { x, y } = genPoint();

		// GitHubの情報をもとに計算する
		const { power, weight, volume, cd } = calcStatus(githubStatus);

		// GitHubユーザー情報を使用する
		const userID = githubUser?.login || "guest";
		const iconUrl =
			githubUser?.avatar_url ||
			"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

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

		ws.onopen = async () => {
			console.log("WebSocket connected");
			setWebsocket(ws);
			setPlayers((prevPlayers) => [
				...prevPlayers,
				{ id: userID, icon: iconUrl, power, weight, volume, cd, x, y },
			]);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "join") {
				if (data.message.id === githubUser?.login) {
					return;
				}
				setPlayers((prevPlayers) => [
					...prevPlayers,
					{
						id: data.message.id,
						icon: data.message.icon_url,
						power: data.message.power,
						weight: data.message.weight,
						volume: data.message.volume,
						cd: data.message.cd,
						x: data.message.point[0],
						y: data.message.point[1],
					},
				]);
			} else if (data.type === "leave") {
				setPlayers((prevPlayers) =>
					prevPlayers.filter((player) => player.id !== data.message.id),
				);
			} else if (data.type === "start") {
				redirectRef.current = true;
				router(`/game?roomId=${roomID}&hoge=${redirectRef.current}`);
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
			if (!redirectRef.current) {
				// ws.close();
			}
		};
	}, []);

	// クリップボードにコピー
	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
		console.log("copied to clipboard");
	};

	return (
		<ClientOnly>
			{() => (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "100vh",
						background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
						color: "#E2E8F0",
						padding: "40px 20px",
					}}
				>
					<div
						style={{
							background: "rgba(30, 41, 59, 0.6)",
							backdropFilter: "blur(12px)",
							padding: "32px",
							borderRadius: "16px",
							border: "1px solid rgba(148, 163, 184, 0.2)",
							maxWidth: "800px",
							width: "100%",
							boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
						}}
					>
						<h1
							style={{
								fontSize: "24px",
								fontWeight: "600",
								textAlign: "center",
								marginBottom: "24px",
								color: "#F8FAFC",
							}}
						>
							Battle Room
						</h1>
						<div
							style={{
								marginBottom: "24px",
								fontSize: "16px",
								textAlign: "center",
								color: "#94A3B8",
							}}
						>
							合言葉を共有して、他のエンジニアと戦ってみよう！
						</div>
						<div className="container">
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "12px",
									background: "rgba(15, 23, 42, 0.6)",
									padding: "12px 24px",
									borderRadius: "8px",
									marginBottom: "32px",
								}}
							>
								<span
									style={{
										fontFamily: "monospace",
										fontSize: "20px",
										color: "#F8FAFC",
									}}
								>
									{roomID}
								</span>
								<button
									onClick={() => copyToClipboard(roomID)}
									className="relative hover:text-emerald-400 transition-colors"
									type="button"
									style={{ color: isCopied ? "#10B981" : "#94A3B8" }}
								>
									<FaRegCopy size={20} />
									{isCopied && (
										<span
											style={{
												position: "absolute",
												top: "-32px",
												left: "50%",
												transform: "translateX(-50%)",
												background: "#059669",
												color: "white",
												padding: "4px 12px",
												borderRadius: "4px",
												fontSize: "12px",
												whiteSpace: "nowrap",
											}}
										>
											Copied!
										</span>
									)}
								</button>
							</div>

							<div className="flex flex-col items-center justify-center gap-2 mb-8 w-full max-w-4xl mx-auto px-4">
								{players.map((player: PlayerData) => (
									<PlayerCard key={player.id} player={player} />
								))}
							</div>

							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: "16px",
								}}
							>
								<Grid
									height="40"
									width="40"
									color="#10B981"
									ariaLabel="loading"
									wrapperStyle={{}}
									wrapperClass="wrapper-class"
									visible={true}
								/>
								<div style={{ color: "#94A3B8", fontSize: "16px" }}>
									Waiting for other engineers to join...
								</div>
								<div style={{ marginTop: "16px" }}>
									<StartButton apiUrl={apiUrl} roomId={roomID} />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</ClientOnly>
	);
};

export default WaitingRoom;
