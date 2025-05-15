import { useState } from "react";

export function JoinToPopup() {
	const [open, setOpen] = useState(false);
	const [keyword, setKeyword] = useState("");

	return (
		<>
			{/* カード風のボタン */}
			<div
				style={{
					background: "#fff",
					borderRadius: "12px",
					boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
					padding: "32px 24px 24px 24px",
					minWidth: "340px",
					maxWidth: "360px",
					margin: "40px auto",
					textAlign: "center",
					border: "1px solid #eee",
				}}
			>
				<h2
					style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 4px 0" }}
				>
					部屋に参加する
				</h2>
				<p style={{ color: "#666", fontSize: "15px", margin: "0 0 28px 0" }}>
					友達が作成した部屋に参加しましょう
				</p>
				<div style={{ margin: "0 0 28px 0" }}>
					{/* シンプルなアイコン（SVG） */}
					<svg
						width="96"
						height="96"
						viewBox="0 0 96 96"
						fill="none"
						style={{ display: "block", margin: "0 auto" }}
					>
						<title>ユーザーアイコン</title>
						<circle cx="48" cy="48" r="48" fill="#F6F7F9" />
						<path
							d="M48 52c7.732 0 14-6.268 14-14s-6.268-14-14-14-14 6.268-14 14 6.268 14 14 14zm0 4c-9.941 0-30 5.02-30 15v5h60v-5c0-9.98-20.059-15-30-15z"
							fill="#D1D5DB"
						/>
					</svg>
				</div>
				<button
					type="button"
					onClick={() => setOpen(true)}
					style={{
						width: "100%",
						padding: "14px 0",
						background: "#111",
						color: "#fff",
						border: "none",
						borderRadius: "8px",
						fontSize: "17px",
						fontWeight: 600,
						cursor: "pointer",
						letterSpacing: "0.05em",
					}}
				>
					部屋に参加
				</button>
			</div>

			{/* ポップアップ本体 */}
			{open && (
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
							minWidth: "400px",
							boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
							position: "relative",
						}}
					>
						<button
							type="button"
							onClick={() => setOpen(false)}
							style={{
								position: "absolute",
								top: 16,
								right: 16,
								background: "none",
								border: "none",
								fontSize: "20px",
								cursor: "pointer",
							}}
							aria-label="閉じる"
						>
							×
						</button>
						<h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 700 }}>
							部屋に参加
						</h2>
						<p style={{ color: "#666", marginBottom: 24 }}>
							あいことばを入力して部屋に参加しましょう
						</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								// ここで参加処理を実装
								setOpen(false);
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
							>
								参加する
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
