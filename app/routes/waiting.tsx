import * as pkg from "react-loader-spinner";
const { Grid } = pkg;
import StartButton from "~/components/StartButton";

type Player = {
	id: string;
	iconUrl: string;
};

interface PlayerCardProps {
	player: Player;
}

const players: Player[] = [
	{
		id: "ogatakatsuya",
		iconUrl: "https://avatars.githubusercontent.com/u/130939004?v=4",
	},
	{
		id: "pan",
		iconUrl: "https://avatars.githubusercontent.com/u/130939004?v=4",
	},
	{
		id: "yotu",
		iconUrl: "https://avatars.githubusercontent.com/u/130939004?v=4",
	},
	{
		id: "zakokun",
		iconUrl: "https://avatars.githubusercontent.com/u/130939004?v=4",
	},
];

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
				<span style={styles.id}>{props.player.id}</span>
			</div>
			{/* 必要に応じて他のプレイヤー情報をここに追加できます */}
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
		fontSize: "1em",
		fontWeight: "bold" as const,
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
	return (
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
	);
};

export default WaitingRoom;
