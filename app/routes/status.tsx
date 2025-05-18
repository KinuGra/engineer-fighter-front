import { useAtomValue } from "jotai";
import { githubGraphQLAtom } from "~/atoms/githubUser";
import StatusCard from "~/components/StatusCard";
import { ToHomeButton } from "~/components/toHomeButton";
import calcStatus from "~/utils/calcStatus";

const Status = () => {
	const userStatus = useAtomValue(githubGraphQLAtom);
	const status = calcStatus(userStatus);

	return (
		<>
			<div className="mt-10 ml-10">
				<ToHomeButton />
			</div>
			<div className="m-10 items">
				<StatusCard status={status} />
			</div>
		</>
	);
};

export default Status;
