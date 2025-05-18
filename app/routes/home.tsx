import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import RoomCard from "~/components/RoomCard";
import { ToCombatPower } from "~/components/toCombatPower";
import CreateRoomModal from "../components/CreateRoomModal";
import JoinRoomModal from "../components/JoinRoomModal";

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const apiUrl = context.cloudflare.env.API_URL;
	return { apiUrl };
};

export default function Home() {
	const [open, setOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const { apiUrl } = useLoaderData<typeof loader>();

	return (
		<div className="w-full flex flex-col items-center px-4 md:px-5">
			<ToCombatPower />

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
			<JoinRoomModal
				apiUrl={apiUrl}
				open={open}
				onClose={() => {
					setOpen(false);
				}}
			/>
			<CreateRoomModal
				apiUrl={apiUrl}
				open={showModal}
				onClose={() => {
					setShowModal(false);
				}}
			/>
		</div>
	);
}
