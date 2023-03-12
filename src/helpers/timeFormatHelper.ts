export function toMillis(time: string) {
// time in format HH:MM
    const t = time.split(":");
    const h = Number(t[0]) * 60 * 60 * 1000;
    const m = Number(t[1]) * 60 * 1000;
    return h + m;
}

export function formatTime(millis: number) {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    if(minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}min`;
}

export function formatNumber(num: string | number) {
    return num.toLocaleString();
}

export function toTime(millis: number) {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes}`;
}