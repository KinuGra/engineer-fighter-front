import { useState } from "react";
import type { GitHubUser } from "~/types/github";
import SignOutButton from "./SignOutButton";

interface HeaderProps {
	user: GitHubUser | null;
}

export default function Header({ user }: HeaderProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="w-full flex items-center justify-between px-8 py-6 dark:bg-gray-900 bg-white shadow-md relative">
			<div className="flex items-center space-x-4">
				{user ? (
					<>
						<img
							src={user.avatar_url}
							alt="avatar"
							className="w-12 h-12 rounded-full bg-gray-200"
						/>
						<div>
							{/* sm未満はuser.nameのみ、sm以上は「こんにちは、{user.name} さん」 */}
							<div className="text-xl font-bold sm:block hidden">
								こんにちは、{user.name} さん
							</div>
							<div className="text-xl font-bold sm:hidden block">
								{user.name}
							</div>
							<div className="text-gray-500 text-sm">@{user.login}</div>
						</div>
					</>
				) : (
					<div className="text-xl font-bold">ようこそ、ゲストさん</div>
				)}
			</div>
			{/* sm未満はハンバーガー、sm以上はSignOutButton */}
			{user && (
				<>
					<button
						className="sm:hidden block p-2"
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label="メニューを開く"
					>
						{/* ハンバーガーアイコン */}
						<span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
						<span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
						<span className="block w-6 h-0.5 bg-gray-700"></span>
					</button>
					<div className="hidden sm:block">
						<SignOutButton />
					</div>
					{/* ハンバーガーメニューの中身 */}
					{menuOpen && (
						<div className="absolute top-full right-8 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded p-4 z-50 sm:hidden">
							<SignOutButton />
						</div>
					)}
				</>
			)}
		</div>
	);
}
