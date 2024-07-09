import { Card } from '../../ts-out/card';
import { GetCard } from '../../ts-out/cards';

const cube_mtgo_vintage_names = [
    "Ancestral Recall",
    "Black Lotus",
];

export function mtgo_vintage_cube(): Card[] {
    let cards = [];
    for (let i = 0; i < cube_mtgo_vintage_names.length; i++) {
        cards.push(GetCard(cube_mtgo_vintage_names[i]));
    }
    return cards;
}

