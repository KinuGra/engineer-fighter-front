import startGame from "~/api/startGame.client";
import { useState } from "react";

const pulseKeyframes = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;

const glowKeyframes = `
@keyframes glow {
    0% { box-shadow: 0 0 5px #10b981; }
    50% { box-shadow: 0 0 20px #10b981; }
    100% { box-shadow: 0 0 5px #10b981; }
}
`;

interface StartButtonProps {
	roomId: string;
	apiUrl: string;
}

export const startGameHandler = async (apiUrl: string, roomID: string) => {
	await startGame(apiUrl, roomID);
};

const StartButton = (props: StartButtonProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<style>
				{pulseKeyframes}
				{glowKeyframes}
			</style>
			<button
				type="button"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={() => startGameHandler(props.roomId, props.apiUrl)}
				className={`
					w-64 py-4 px-8 rounded-lg
					bg-gradient-to-r from-emerald-500 to-emerald-600
					text-white font-bold text-xl
					transform transition-all duration-300
					hover:scale-105 hover:shadow-xl
					focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
					${isHovered ? "animate-[pulse_1.5s_infinite] animate-[glow_1.5s_infinite]" : ""}
					relative overflow-hidden
					before:content-[''] before:absolute before:top-0 before:left-0
					before:w-full before:h-full before:bg-white/20
					before:transform before:translate-x-[-100%] before:skew-x-[-45deg]
					hover:before:translate-x-[200%] before:transition-transform before:duration-700
				`}
			>
				<div className="flex items-center justify-center space-x-3">
					<svg
						className={`w-6 h-6 ${isHovered ? "animate-spin" : ""}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>ゲームスタート</span>
				</div>
			</button>
		</>
	);
};

export default StartButton;
