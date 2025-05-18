import { useNavigate } from "@remix-run/react";
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
    0% { box-shadow: 0 0 5px #4f46e5; }
    50% { box-shadow: 0 0 20px #4f46e5; }
    100% { box-shadow: 0 0 5px #4f46e5; }
}
`;

export const ToCombatPower = () => {
	const [isHovered, setIsHovered] = useState(false);
	const router = useNavigate();

	return (
		<>
			<style>
				{pulseKeyframes}
				{glowKeyframes}
			</style>
			<div className="p-4">
				<button
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					className={`
                        w-full py-4 px-6 rounded-lg
                        bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white font-bold text-lg
                        transform transition-all duration-300
                        hover:scale-105 hover:shadow-xl
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        ${isHovered ? "animate-[pulse_1.5s_infinite] animate-[glow_1.5s_infinite]" : ""}
                        relative overflow-hidden
                        before:content-[''] before:absolute before:top-0 before:left-0
                        before:w-full before:h-full before:bg-white/20
                        before:transform before:translate-x-[-100%] before:skew-x-[-45deg]
                        hover:before:translate-x-[200%] before:transition-transform before:duration-700
                    `}
					onClick={() => router("/status")}
				>
					<div className="flex items-center justify-center space-x-2">
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
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						<span>エンジニア戦闘力を測定</span>
					</div>
				</button>
			</div>
		</>
	);
};
