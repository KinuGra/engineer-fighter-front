import RoomCard from "~/components/RoomCard";

export default function Home() {
	return (
		<div className="w-full flex flex-col items-center px-4 md:px-5">
			{/* メインカード部分 */}
			<div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center mt-8">
				<RoomCard
					title="部屋を作成する"
					description="新しいゲーム部屋を作成して友達を招待しましょう"
					icon="create"
					onClick={() => {
						// TODO: 部屋作成処理
					}}
				/>
				<RoomCard
					title="部屋に参加する"
					description="友達が作成した部屋に参加しましょう"
					icon="join"
					onClick={() => {
						// TODO: 部屋参加処理
					}}
				/>
			</div>
		</div>
	);
}
