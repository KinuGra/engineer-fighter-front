import { atom } from "jotai";
import { PlayerData } from "~/features/game/core/config/gameSettings";

export const playersAtom = atom<PlayerData[]>([]);