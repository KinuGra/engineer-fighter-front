import { atom } from "jotai";

export const websocketAtom = atom<WebSocket | null>(null);
