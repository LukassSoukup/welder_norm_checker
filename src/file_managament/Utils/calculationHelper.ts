import Path from "path";
import {DAILY_LOG_FILE_PATH, inconsistentDataErr} from "../constants/file_paths";
import {updateProduct} from "../../api/productController";
import {toMillis} from "../../helpers/timeFormatHelper";
import {updateEmployee} from "../../api/employeeController";
import {calculateEmployeeWorkAllocation} from "../../helpers/calculationHelper";

export function getMonthDir(_month?: string) {
    const time = _month ? new Date(_month) : new Date();
    const month = time.getMonth() + 1;
    const path = `${time.getFullYear()}/${month < 10 ? "0" + month : month}`
    return Path.join(DAILY_LOG_FILE_PATH, path);
}

export function ensureOneLogPerDay(logs: IDailyLog[], recorded: string) {
    const is = logs?.some(log => new Date(log.recorded).toLocaleDateString() === new Date(recorded).toLocaleDateString());
    if (is) {
        const e = new Error("Zaměstnanec si může vykázat za den pouze jednou!");
        e.name = "OncePerDayLog";
        throw e;
    }
}

export function isIsoDate(str: string) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(Number(d)) && d.toISOString() === str;
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

export function calculateMoneyEarnedAndNormTime(totalWorkTime: number, totalProductTime: number, hourlyRate: number) {
    const hour = 1000 * 60 * 60;
    const totalHourWorkTime = totalWorkTime / hour;
    const totalNormTime = totalProductTime - totalWorkTime;
    const moneyEarned = totalHourWorkTime * hourlyRate;

    return {totalNormTime, moneyEarned};
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

export function handleEmployeeWorkChange(employee: IEmployee, productAmountList: IProductAmountList, products: IProduct[]) {
    for (const articleNum in productAmountList) {
        if (employee.assignedWork[articleNum]) {
            employee.assignedWork[articleNum] -= productAmountList[articleNum];
            employee.assignedWorkTime -= calculateAssignWorkTime(products.find(p => p.articleNum === articleNum), productAmountList[articleNum]);
            if(employee.assignedWork[articleNum] < 0) {
                const err = new Error("Nelze vykázat víc práce, než kolik je přiděleno");
                err.name = "assignedWork";
                throw err;
            }
        } else {
            const err = new Error("Nelze vykázat práci na výrobek, který není přiřazený");
            err.name = "cantLogWorkForUnassignedWork";
            throw err;
        }
    }
    updateEmployee(employee);
}

export function ensureWorkAllocationNotExceedingProductAmount(employeeList: IEmployee[], productList: IProduct[]) {
    const totalAllocatedWork = calculateEmployeeWorkAllocation(employeeList);
    for(const articleNum in totalAllocatedWork) {
        const product = productList.find(p => p.articleNum === articleNum);
        if(product.amount < totalAllocatedWork[product.articleNum]) {
            const err = new Error("Nedostečné množství produktů!");
            err.name = "insufficientAmount";
            throw err;
        }
    }
}

export function calculateAssignWorkTime(product: IProduct, amount: number) {
    const millis = toMillis(product.timeToComplete);
    return millis * amount;
}