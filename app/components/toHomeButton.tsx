import { useNavigate } from "@remix-run/react";
import { SlArrowLeftCircle } from "react-icons/sl";


export const ToHomeButton = () => {
	const navigate = useNavigate();

	return (
		<button
			className="py-3 px-5 rounded-lg border border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold flex items-center gap-1"
			onClick={() => {
				navigate("/home");
			}}
		>
			<SlArrowLeftCircle />
			戻る
		</button>
	);
};
