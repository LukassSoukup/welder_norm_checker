import {dialog, ipcMain} from "electron";
import Path from "path";
import {deleteFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import {toMillis} from "../shared_resources/timeFormatHelper";
import {
    calculateNormAccomplishment,
    ensureOneLogPerDay,
    getMonthDir, handleProductAmountChange,
} from "../file_managament/Utils/calculationHelper";
import {
    validateDailyLogAddInput,
    validateDailyLogGetInput,
    validateDailyLogListInput, validateISODateFormatInput
} from "../file_managament/Utils/inputValidation";
import {
    errorLogger, InvalidValueErr, PRODUCT_FILE_PATH,
    ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";

const TYPE = "výkazu"

ipcMain.on('addDailyLog', async (event, employeeId: string, moneyEarned: number, dailyLog: IDailyLog, date?: string) => {
    try {
        validateDailyLogAddInput(employeeId, dailyLog);
        if (date) validateISODateFormatInput(date);
        dailyLog.workTime = toMillis(dailyLog.leftWork) - toMillis(dailyLog.arrivedToWork);
        dailyLog.recorded = new Date().toISOString();
        const fpath = Path.join(getMonthDir(date), employeeId);
        const log: IEmployeesDailyLog = await loadFile(fpath);
        ensureOneLogPerDay(log.dailyLog, dailyLog.recorded, date);
        log.dailyLog.push(dailyLog);
        const products: IProduct[] = await loadFiles(Path.join(PRODUCT_FILE_PATH));

        const {totalWorkTime, totalProductTime, normAccomplished} = calculateNormAccomplishment(log.dailyLog, products);
        log.moneyEarned += moneyEarned;
        log.totalWorkTime = totalWorkTime;
        log.totalProductTime = totalProductTime;
        log.normAccomplished = normAccomplished;

        handleProductAmountChange(products, dailyLog.productList)
        await updateFile(fpath, log);
    } catch (err) {
        errorLogger(err);
        if (err.name === "OncePerDayLog") dialog.showErrorBox(`Tento zaměstnanec má za dnešek již vykázáno.`, err.message);
        else if (err.name === 'invalidISODate') InvalidValueErr(err);
        else ValidationCreateErr(TYPE, err, employeeId);
    }
});

ipcMain.handle('getDailyLog', async (event, employeeId: string, recorded: string, date?: string) => {
    try {
        validateDailyLogGetInput(employeeId, recorded);
        if (date) validateISODateFormatInput(date);
        const logs: IEmployeesDailyLog = await loadFile(Path.join(getMonthDir(date), employeeId));
        return logs.dailyLog.filter((log: IDailyLog) => new Date(log.recorded).toLocaleDateString() === new Date(recorded).toLocaleDateString())
    } catch (err) {
        errorLogger(err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        else ValidationGetErr(TYPE, err, employeeId);
    }
});

ipcMain.handle('listLogsByMonthAndEmployee', async (event, employeeId: string, date?: string /*ISOString*/) => {
    try {
        validateDailyLogListInput(employeeId);
        if (date) validateISODateFormatInput(date);
        return await loadFile(Path.join(getMonthDir(date), employeeId));
    } catch (err) {
        errorLogger(err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        else ValidationGetErr(TYPE, err, employeeId);
    }
});

ipcMain.handle('listAllLogsByMonth', async (event, date /*ISOString*/) => {
    try {
        if (date) validateISODateFormatInput(date);
        return await loadFiles(Path.join(getMonthDir(date)));
    } catch (err) {
        errorLogger(err);
        InvalidValueErr(err);
    }
});

ipcMain.on('updateDailyLog', async (event, employeeId: string, recorded: string, dailyLog: IDailyLog, date?: string) => {
    try {
        validateDailyLogGetInput(employeeId, recorded);
        if (date) validateISODateFormatInput(date);
        const fpath = Path.join(getMonthDir(date), employeeId);
        const oldLog: IEmployeesDailyLog = await loadFile(fpath);
        const oldDailyLogIndex: number = oldLog.dailyLog.findIndex((log: IDailyLog) => new Date(log.recorded).toLocaleDateString() === new Date(recorded).toLocaleDateString());
        oldLog.dailyLog[oldDailyLogIndex] = dailyLog;
        await updateFile(fpath, oldLog);
    } catch (err) {
        errorLogger(err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        ValidationUpdateErr(TYPE, err, employeeId);
    }
});

ipcMain.on('deleteDailyLog', async (event, employeeId: string, date?: string) => {
    try {
        validateDailyLogListInput(employeeId);
        if (date) validateISODateFormatInput(date);
        await deleteFile(Path.join(getMonthDir(date), employeeId));
    } catch (err) {
        errorLogger(err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        ValidationDeleteErr(TYPE, err, employeeId);
    }
});