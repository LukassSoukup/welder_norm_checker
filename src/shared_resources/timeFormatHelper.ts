export function toMillis(time: string) {
// time in format HH:MM
    const t = time.split(":");
    const h = Number(t[0]) * 60 * 60 * 1000;
    const m = Number(t[1]) * 60 * 1000;
    return h + m;
}

export function toTime(millis: number) {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes}`;
}