import React, { useState } from "react";
import RoomCard from "~/components/RoomCard";
import CreateRoomModal from "../components/CreateRoomModal";
import JoinRoomModal from "../components/JoinRoomModal";

export default function Home() {
	const [open, setOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	return (
		<div className="w-full flex flex-col items-center px-4 md:px-5">
			{/* メインカード部分 */}
			<div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center mt-8">
				<RoomCard
					title="部屋を作成する"
					description="新しいゲーム部屋を作成して友達を招待しましょう"
					icon="create"
					onClick={() => {
						setShowModal(true);
					}}
				/>
				<RoomCard
					title="部屋に参加する"
					description="友達が作成した部屋に参加しましょう"
					icon="join"
					onClick={() => {
						setOpen(true);
					}}
				/>
			</div>
			<JoinRoomModal open={open} onClose={() => setOpen(false)} />
			<CreateRoomModal open={showModal} onClose={() => setShowModal(false)} />
		</div>
	);
}
