import { useNavigate } from "@remix-run/react";
export const ToHomeButton = () => {
	const navigate = useNavigate();

	return (
		<button
			className="flex-1 py-3 px-5 rounded-lg border border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
			onClick={() => {
				navigate("/home");
			}}
		>
			ホームに戻る
		</button>
	);
};
