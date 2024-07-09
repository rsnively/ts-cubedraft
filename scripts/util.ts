export function isDigit(c: string): boolean {
    return typeof c === 'string' && c.length == 1 && c >= '0' && c <= '9';
}

export function toDigit(c: string): number {
    return c.charCodeAt(0) - '0'.charCodeAt(0);
}