interface RoomCardProps {
	title: string;
	description: string;
	icon: "create" | "join";
	onClick: () => void;
}

export default function RoomCard({
	title,
	description,
	icon,
	onClick,
}: RoomCardProps) {
	return (
		<div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
			<div className="text-2xl font-bold mb-2">{title}</div>
			<div className="text-gray-500 mb-6">{description}</div>
			<div className="flex items-center justify-center mb-6 h-20">
				{icon === "create" ? (
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#cbd5e1"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="16" />
						<line x1="8" y1="12" x2="16" y2="12" />
					</svg>
				) : (
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#cbd5e1"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="7" r="4" />
						<path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
					</svg>
				)}
			</div>
			<button
				onClick={onClick}
				className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition"
			>
				{title}
			</button>
		</div>
	);
}
