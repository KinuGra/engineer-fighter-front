import type { GitHubUser } from "~/types/github";
import SignOutButton from "./SignOutButton";

interface HeaderProps {
	user: GitHubUser | null;
}

export default function Header({ user }: HeaderProps) {
	return (
		<div className="w-full flex items-center justify-between px-8 py-6">
			<div className="flex items-center space-x-4">
				{user && (
					<>
						<img
							src={user.avatar_url}
							alt="avatar"
							className="w-12 h-12 rounded-full bg-gray-200"
						/>
						<div>
							<div className="text-xl font-bold">
								こんにちは、{user.name} さん
							</div>
							<div className="text-gray-500 text-sm">@{user.login}</div>
						</div>
					</>
				)}
			</div>
			<div>
				<SignOutButton />
			</div>
		</div>
	);
}
