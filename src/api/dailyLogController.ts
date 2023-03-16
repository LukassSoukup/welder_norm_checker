import {dialog, ipcMain} from "electron";
import Path from "path";
import {createFilePath} from "../file_managament/Utils/file_validator";
import {
    createFile,
    deleteFile,
    fileExists,
    loadFile,
    loadFiles,
    updateFile
} from "../file_managament/Utils/file_manager";
import {
    calculateMoneyEarnedAndNormTime,
    calculateNormAccomplishment,
    ensureOneLogPerDay,
    getMonthDir, handleEmployeeWorkChange, handleProductAmountChange,
} from "../file_managament/Utils/calculationHelper";
import {
    validateDailyLogAddInput,
    validateDailyLogGetInput,
    validateDailyLogListInput, validateISODateFormatInput
} from "../file_managament/Utils/inputValidation";
import {
    AssignedWorkErr,
    errorLogger, InvalidValueErr, LogForUnassignedWorkErr, NoRecordForGivenDate, PRODUCT_FILE_PATH,
    ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";

const TYPE = "výkazu"

ipcMain.on('addDailyLog', async (event, employee: IEmployee, dailyLog: IDailyLog, date?: string) => {
    try {
        validateDailyLogAddInput(employee, dailyLog);
        if (date) {
            validateISODateFormatInput(date);
            dailyLog.recorded = date;
        }else dailyLog.recorded = new Date().toISOString();

        const fpath = Path.join(getMonthDir(date), employee.id);
        if(!await fileExists(fpath)) {
            createFilePath(getMonthDir(date));
            await createFile(fpath, {employeeId: employee.id, moneyEarned: 0, dailyLog: []});
        }

        const log: IEmployeesDailyLog = await loadFile(fpath);
        ensureOneLogPerDay(log.dailyLog, dailyLog.recorded);
        dailyLog.workTime -=  30 * 60 * 1000; // Lunch break
        const dailyStats = calculateMoneyEarnedAndNormTime(dailyLog.workTime, dailyLog.productTime, employee.hourlyRate);
        dailyLog.normAccomplished = dailyLog.workTime <= dailyLog.productTime;
        dailyLog.normTime = dailyStats.totalNormTime;
        dailyLog.moneyEarned = dailyStats.moneyEarned;
        log.dailyLog.push(dailyLog);
        log.dailyLog.sort((a: IDailyLog, b: IDailyLog) => (new Date(a.recorded) > new Date(b.recorded)) ? 1 : ((new Date(b.recorded) > new Date(a.recorded)) ? -1 : 0));
        const products: IProduct[] = await loadFiles(Path.join(PRODUCT_FILE_PATH));

        const {totalWorkTime, totalProductTime, normAccomplished} = calculateNormAccomplishment(log.dailyLog, products);
        const {moneyEarned, totalNormTime} = calculateMoneyEarnedAndNormTime(totalWorkTime, totalProductTime, employee.hourlyRate);
        log.moneyEarned += moneyEarned;
        log.totalWorkTime = totalWorkTime;
        log.totalProductTime = totalProductTime;
        log.normAccomplished = normAccomplished;
        log.totalNormTime = totalNormTime;

        handleEmployeeWorkChange(employee, dailyLog.productList, products);
        handleProductAmountChange(products, dailyLog.productList);
        await updateFile(fpath, log);
    } catch (err) {
        errorLogger(err);
        if (err.name === "OncePerDayLog") dialog.showErrorBox(`Tento zaměstnanec má za dnešek již vykázáno.`, err.message);
        else if (err.name === 'invalidISODate') InvalidValueErr(err);
        else if (err.name === 'assignedWork') AssignedWorkErr(err);
        else if(err.name === "cantLogWorkForUnassignedWork") LogForUnassignedWorkErr(err);
        else ValidationCreateErr(TYPE, err, employee.id);
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
        if(date && err.code === "ENOENT") return NoRecordForGivenDate(date, err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        else ValidationGetErr(TYPE, err, employeeId);
    }
});

ipcMain.handle('listLogsByMonthAndEmployee', async (event, employeeId: string, date?: string /*ISOString*/) => {
    try {
        validateDailyLogListInput(employeeId);
        if (date) validateISODateFormatInput(date);
        return await loadFile(Path.join(getMonthDir(date), employeeId), "forDailyLog");
    } catch (err) {
        errorLogger(err);
        if(date && err.code === "ENOENT") return NoRecordForGivenDate(date, err);
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
        if(date && err.code === "ENOENT") return NoRecordForGivenDate(date, err);
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
        if(date && err.code === "ENOENT") return NoRecordForGivenDate(date, err);
        if (err.name === 'invalidISODate') return InvalidValueErr(err);
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
        if(date && err.code === "ENOENT") return NoRecordForGivenDate(date, err);
        if (err.name === 'invalidISODate') return InvalidValueErr(err);
        ValidationDeleteErr(TYPE, err, employeeId);
    }
});