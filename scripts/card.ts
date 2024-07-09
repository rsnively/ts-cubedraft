import { isDigit, toDigit } from "../ts-out/util";

export enum Type { Artifact, Battle, Creature, Enchantment, Instant, Land, Planeswalker, Sorcery, Tribal };
export enum Color { White, Blue, Black, Red, Green };

const color_chars = ['W', 'U', 'B', 'R', 'G'];

function ColorForChar(c: string): Color | void {
    switch (c) {
        case 'W': return Color.White;
        case 'U': return Color.Blue;
        case 'B': return Color.Black;
        case 'R': return Color.Red;
        case 'G': return Color.Green;
    }
}

export class Card {
    name: string;
    multiverseid: number;
    casting_cost: string;
    types: Type[];

    constructor(name: string, multiverseid: number, casting_cost: string, types: Type | Type[]) {
        this.name = name;
        this.multiverseid = multiverseid;
        this.casting_cost = casting_cost;
        this.types = [].concat(types);
    }

    ManaValue(): number {
        let specific = 0;
        let generic = 0;
        for (let i = 0; i < this.casting_cost.length; i++) {
            const c = this.casting_cost.charAt(i);
            if (color_chars.includes(c)) {
                specific++;
            } else if (isDigit(c)) {
                generic = generic * 10 + toDigit(c);
            }
        }
        return specific + generic;
    }

    Colors(): Color[] {
        let colors = [];
        for (let i = 0; i < this.casting_cost.length; i++) {
            const c = this.casting_cost.charAt(i);
            if (c != undefined && !colors.includes(c)) {
                colors.push(c);
            }
        }
        return colors;
    }
}