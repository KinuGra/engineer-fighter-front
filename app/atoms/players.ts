import { atom } from "jotai";
import type { PlayerData } from "~/features/game/core/config/gameSettings";

export const playersAtom = atom<PlayerData[]>([]);
