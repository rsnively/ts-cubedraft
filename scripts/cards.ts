import { Card, Type } from "../ts-out/cards";

const cards: Card[] = [
    new Card("Ancestral Recall", 382841, "U", Type.Instant),
    new Card("Black Lotus", 382866, "0", Type.Artifact),
];

function GetCard(card_name: string): Card | void {
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card.name === card_name) {
            return card;
        }
    }
}