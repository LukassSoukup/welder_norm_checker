// time in format HH:MM
import Path from "path";
import {DAILY_LOG_FILE_PATH} from "../constants/file_paths";

export function toMillis(time: string) {
    const date = new Date(`1970-01-01T${time}:00`);
    return date.getTime();
}

export function toTime(millis: number) {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes}`;
}

export function getMonthDir(_month?: string) {
    const time = _month ? new Date(_month) : new Date();
    const month = time.getMonth() + 1;
    const path = `${month < 10 ? "0" + month : month}/${time.getFullYear()}`
    return Path.join(DAILY_LOG_FILE_PATH, path);
}

export function ensureOneLogPerDay(logs: IDailyLog[], recorded: string) {
    const is = logs.some(log => new Date(log.recorded).toLocaleDateString() === new Date(recorded).toLocaleDateString());
    if(is) {
        const e = new Error("Zaměstnanec si může vykázat za den pouze jednou!");
        e.name = "OncePerDayLog";
        throw e;
    }
}

export function isIsoDate(str: string) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(Number(d)) && d.toISOString()===str;
}