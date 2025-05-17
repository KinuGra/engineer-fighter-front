import { useNavigate } from "@remix-run/react";
import type React from "react";
import { useState } from "react";
import { JoinRoom } from "~/api/joinRoom.client";
import type { JoinRoomRequest } from "~/api/joinRoom.client";
import * as pkg from "react-loader-spinner";
const { Grid, InfinitySpin } = pkg;
import { ClientOnly } from "remix-utils/client-only";

interface JoinRoomModalProps {
	open: boolean;
	onClose: () => void;
	apiUrl: string;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
	open,
	onClose,
	apiUrl,
}) => {
	const [keyword, setKeyword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const router = useNavigate();

	if (!open) return null;
	return (

		<ClientOnly>
			{() => (
				<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					background: "rgba(0,0,0,0.3)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
				}}
			>
				<div
					style={{
						background: "#fff",
						borderRadius: "12px",
						padding: "32px",
						minWidth: "340px",
						boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
						position: "relative",
					}}
				>
					<button
						type="button"
						style={{
							position: "absolute",
							top: 16,
							right: 16,
							background: "none",
							border: "none",
							fontSize: "20px",
							cursor: "pointer",
							color: "black"
						}}
						aria-label="閉じる"
<<<<<<< HEAD
						onClick={() => {open = false}}
=======
						onClick={onClose}
>>>>>>> c17b451f388cf2852a3e79aecff01e198481a5c6
					>
						×
					</button>
					<h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700, color: "black"}}>
						部屋に参加
					</h2>
					<p style={{ color: "#666", marginBottom: 24 }}>
						あいことばを入力して部屋に参加しましょう
					</p>
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							// 参加処理をここに実装
							const request: JoinRoomRequest = {
								password: keyword,
							};

							const data = await JoinRoom(request, apiUrl);

							console.log("data:", data);
							if (data.status === "ok") {
								router(`/waiting?roomId=${keyword}`);
							} else {
								alert("合言葉が間違っています");
								setSubmitting(false);
							}
						}}
					>
						<div style={{ marginBottom: 28 }}>
							<label
								htmlFor="password"
								style={{ fontWeight: 600, display: "block", marginBottom: 6 }}
							>
								あいことば
							</label>
							<input
								type="text"
								id="password"
								placeholder="例: たのしいゲーム"
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								style={{
									width: "100%",
									padding: "10px",
									border: "1px solid #ddd",
									borderRadius: "6px",
									fontSize: "16px",
								}}
							/>
							<div style={{ color: "#888", fontSize: "13px", marginTop: 4 }}>
								部屋に参加するために必要なあいことばを入力してください
							</div>
						</div>
						<button
							type="submit"
							style={{
								width: "100%",
								padding: "12px 0",
								background: "#111",
								color: "#fff",
								border: "none",
								borderRadius: "8px",
								fontSize: "17px",
								fontWeight: 600,
								cursor: "pointer",
							}}
							onClick={() => setSubmitting(true)}
						>
							<div className="flex items-center justify-center h-10">
									{submitting ?(
										<InfinitySpin
											width="200"
										/>
									):(
										<span>参加する</span>
									)}
							</div>
						</button>
					</form>
				</div>
			</div>
			)}
		</ClientOnly>
	);
};

export default JoinRoomModal;
