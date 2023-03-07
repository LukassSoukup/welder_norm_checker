import fs from "fs/promises";
import {errorLogger, infoLogger} from "../file_managament/constants/file_paths";
import fetch, {Headers} from "node-fetch";

export async function updateCurrencyRate(to: string, from: string, amount: number) {
    const myHeaders = new Headers();
    myHeaders.append("apikey", "UQI6BUAy7xW6c8CskVVvPx1LCMik3Soq");

    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const res = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`, requestOptions);
        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json() as ICurrencyAPIResponse;
        saveForLater(data);
    } catch (err) {
        console.error('Error fetching exchange rates:', err);
        errorLogger(err.message);
    }
}

function saveForLater(result: object) {
    fs.writeFile("../storage/currency_rate.txt", JSON.stringify(result, null, 2))
        .then(() => infoLogger("Currency rate saved"))
        .catch(e => errorLogger(e.message));
}

export async function getCurrentCurrencyRate(): Promise<number> {
    try {
        const content = await fs.readFile("../storage/currency_rate.txt", "utf8");
        const response: ICurrencyAPIResponse = JSON.parse(content);
        return response.info.rate;
    } catch (err) {
        errorLogger(err.message);
    }
}