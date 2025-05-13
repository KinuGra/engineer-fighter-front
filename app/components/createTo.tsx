import { useState } from "react";

const maxPlayersOptions = ["2人", "3人", "4人", "5人", "6人"];

function CreateRoomCard({ onOpen }: { onOpen: () => void }) {
	return (
		<div style={cardStyles.card}>
			<h2 style={cardStyles.title}>部屋を作成する</h2>
			<p style={cardStyles.subtitle}>
				新しいゲーム部屋を作成して友達を招待しましょう
			</p>
			<div style={cardStyles.iconCircle}>
				<span style={cardStyles.plus}>＋</span>
			</div>
			<button type="button" style={cardStyles.button} onClick={onOpen}>
				部屋を作成
			</button>
		</div>
	);
}

export function CreateRoomPage() {
	const [showModal, setShowModal] = useState(false);

	const [roomName, setRoomName] = useState("");
	const [maxPlayers, setMaxPlayers] = useState("4人");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert("部屋を作成しました！");
		setShowModal(false);
	};

	return (
		<>
			<CreateRoomCard onOpen={() => setShowModal(true)} />
			{showModal && (
				<div style={styles.overlay}>
					<div style={styles.modal}>
						<button
							type="button"
							style={styles.backButton}
							onClick={() => setShowModal(false)}
						>
							&lt; 戻る
						</button>
						<h2 style={styles.title}>部屋を作成</h2>
						<p style={styles.subtitle}>
							あいことばを設定して部屋を作成しましょう
						</p>
						<form onSubmit={handleSubmit}>
							<div style={styles.formGroup}>
								<label htmlFor="roomName">部屋の名前</label>
								<input
									type="text"
									id="roomName"
									placeholder="例: 楽しいゲーム部屋"
									value={roomName}
									onChange={(e) => setRoomName(e.target.value)}
									style={styles.input}
									required
								/>
							</div>
							<div style={styles.formGroup}>
								<label htmlFor="maxPlayers">最大プレイヤー数</label>
								<select
									value={maxPlayers}
									id="maxPlayers"
									onChange={(e) => setMaxPlayers(e.target.value)}
									style={styles.input}
								>
									{maxPlayersOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</div>
							<button type="submit" style={styles.submitButton}>
								部屋を作成
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

const cardStyles: { [key: string]: React.CSSProperties } = {
	card: {
		background: "#fff",
		borderRadius: 12,
		padding: 32,
		width: 400,
		margin: "40px auto",
		boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
		textAlign: "center",
		border: "1px solid #eee",
	},
	title: {
		fontSize: 26,
		fontWeight: 700,
		margin: "0 0 8px 0",
		color: "black",
	},
	subtitle: {
		color: "#888",
		fontSize: 15,
		margin: "0 0 24px 0",
	},
	iconCircle: {
		width: 96,
		height: 96,
		borderRadius: "50%",
		border: "6px solid #d3d8df",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: "0 auto 32px auto",
		background: "#f8fafc",
	},
	plus: {
		fontSize: 56,
		color: "#b0b7c3",
		fontWeight: 400,
		lineHeight: 1,
	},
	button: {
		width: "100%",
		padding: "14px 0",
		background: "#111",
		color: "#fff",
		border: "none",
		borderRadius: 8,
		fontSize: 18,
		fontWeight: 700,
		cursor: "pointer",
		marginTop: 12,
	},
};

const styles: { [key: string]: React.CSSProperties } = {
	overlay: {
		position: "fixed",
		inset: 0,
		background: "rgba(0,0,0,0.08)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1000,
	},
	modal: {
		background: "#fff",
		borderRadius: 16,
		padding: 32,
		width: 480,
		boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
		position: "relative",
	},
	backButton: {
		position: "absolute",
		left: 16,
		top: 16,
		background: "none",
		border: "none",
		fontSize: 18,
		cursor: "pointer",
		color: "#222",
	},
	title: {
		margin: "0 0 8px 0",
		fontWeight: 700,
		fontSize: 24,
	},
	subtitle: {
		margin: "0 0 24px 0",
		color: "#666",
		fontSize: 15,
	},
	formGroup: {
		marginBottom: 20,
		display: "flex",
		flexDirection: "column" as const,
		gap: 6,
	},
	input: {
		padding: "10px 12px",
		border: "1px solid #ccc",
		borderRadius: 8,
		fontSize: 16,
		outline: "none",
	},
	submitButton: {
		width: "100%",
		padding: "14px 0",
		background: "#111",
		color: "#fff",
		border: "none",
		borderRadius: 8,
		fontSize: 18,
		fontWeight: 700,
		cursor: "pointer",
		marginTop: 12,
	},
};
