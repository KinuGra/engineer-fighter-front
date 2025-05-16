import { LoaderFunctionArgs } from "@remix-run/node";

export function loader(args: LoaderFunctionArgs) {
  return null;
}

export default function GameScreen() {
  return (
    <h1
      style={{
        textAlign: "center",
        fontSize: "64px",
      }}
    >
      ゲーム画面
    </h1>
  );
}