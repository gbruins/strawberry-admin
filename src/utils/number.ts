/** Round to `decimals` places (returns the input unchanged if it isn't a finite number). */
export function round(value: number, decimals = 0): number {
    if (!Number.isFinite(value)) {
        return value;
    }

    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
