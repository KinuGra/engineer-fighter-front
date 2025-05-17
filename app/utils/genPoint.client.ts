import { FIELD_WIDTH, FIELD_HEIGHT } from "~/features/game/core/config/config";

const MARGIN = 40;

const genPoint = () => {
    const x = Math.floor(Math.random() * (FIELD_WIDTH - 2 * MARGIN)) + MARGIN;
    const y = Math.floor(Math.random() * (FIELD_HEIGHT - 2 * MARGIN)) + MARGIN;
    return { x, y };
}

export default genPoint;
