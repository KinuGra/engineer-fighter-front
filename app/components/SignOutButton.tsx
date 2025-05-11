import { Form } from "@remix-run/react";

const SignOutButton = () => {
    return (
        <Form method="post">
        <button
            type="submit"
            className="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-3 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                />
            </svg>
            <span className="text-base font-medium">ログアウト</span>
        </button>
    </Form>
    )
}

export default SignOutButton;