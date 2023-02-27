import Path from "path";
import {DAILY_LOG_FILE_PATH, inconsistentDataErr} from "../constants/file_paths";
import {updateProduct} from "../../api/productController";
import {toMillis} from "../../shared_resources/timeFormatHelper";

export function getMonthDir(_month?: string) {
    const time = _month ? new Date(_month) : new Date();
    const month = time.getMonth() + 1;
    const path = `${time.getFullYear()}/${month < 10 ? "0" + month : month}`
    return Path.join(DAILY_LOG_FILE_PATH, path);
}

export function ensureOneLogPerDay(logs: IDailyLog[], recorded: string, date?: string) {
    let is;
    if(date) is = logs?.some(log => new Date(log.recorded).toLocaleDateString() === date);
    else is = logs?.some(log => new Date(log.recorded).toLocaleDateString() === new Date(recorded).toLocaleDateString());
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

export function calculateNormAccomplishment(dailyLogs: IDailyLog[], products: IProduct[]) {
    let totalWorkTime = 0;
    let totalProductTime = 0;
    const productAmountList: IProductAmountList = {};
    dailyLogs.forEach((log) => {
        totalWorkTime += log.workTime;
        Object.keys(log.productList).forEach(articleNum => {
            if (!productAmountList[articleNum]) productAmountList[articleNum] = log.productList[articleNum];
            else productAmountList[articleNum] += log.productList[articleNum];
        })
    });

    products.forEach((product) => {
        if (productAmountList[product.articleNum]) {
            totalProductTime += (toMillis(product.timeToComplete) * productAmountList[product.articleNum]);
        }
    });
    return {totalWorkTime, totalProductTime, normAccomplished: totalWorkTime <= totalProductTime};
}

export function handleProductAmountChange(products: IProduct[], productAmountList: IProductAmountList) {
    products.forEach((product) => {
        if (productAmountList[product.articleNum]) {
            product.amount -= productAmountList[product.articleNum];
            if (product.amount < 0) inconsistentDataErr(product.articleNum);
            else updateProduct(product);
        }
    });
}