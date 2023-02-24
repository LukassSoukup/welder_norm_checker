import {dialog, ipcMain} from "electron";
import {
    validateDailyLogAddInput,
    validateDailyLogGetInput,
    validateDailyLogListInput, validateISODateFormatInput
} from "../file_managament/Utils/inputValidation";
import {deleteFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import {ensureOneLogPerDay, getMonthDir, toMillis} from "../file_managament/Utils/calculationHelper";
import Path from "path";
import {
    errorLogger, InvalidValueErr,
    ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";

const TYPE = "výkazu"

ipcMain.on('addDailyLog', async (event, employeeId: string, dailyLog: IDailyLog) => {
    try {
        validateDailyLogAddInput(employeeId, dailyLog);
        dailyLog.workTime = toMillis(dailyLog.leftWork) - toMillis(dailyLog.arrivedToWork);
        dailyLog.recorded = new Date().toISOString();
        const fpath = Path.join(getMonthDir(), employeeId);
        const log = await loadFile(fpath);
        ensureOneLogPerDay(log.dailyLogs, dailyLog.recorded);
        log.dailyLogs.push(dailyLog)
        await updateFile(Path.join(getMonthDir(), employeeId), log);
    } catch (err) {
        errorLogger(err);
        if (err.name === "OncePerDayLog") dialog.showErrorBox(`Tento zaměstnanec má za dnešek již vykázáno.`, err.message);
        else ValidationCreateErr(TYPE, err, employeeId);
    }
});

ipcMain.handle('getDailyLog', async (event, employeeId: string, recorded: string, date: string) => {
    try {
        validateDailyLogGetInput(employeeId, recorded);
        if (date) validateISODateFormatInput(date);
        const logs = await loadFile(Path.join(getMonthDir(), employeeId));
        return logs.dailyLog.filter((log: IDailyLog) => new Date(log.recorded).toLocaleDateString() === new Date(recorded).toLocaleDateString())
    } catch (err) {
        errorLogger(err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        else ValidationGetErr(TYPE, err, employeeId);
    }
});

ipcMain.handle('listLogsByMonthAndEmployee', async (event, employeeId: string, date: string /*ISOString*/) => {
    try {
        validateDailyLogListInput(employeeId);
        if (date) validateISODateFormatInput(date);
        const logs = await loadFile(Path.join(getMonthDir(date), employeeId));
        return logs.dailyLog;
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

ipcMain.on('updateDailyLog', async (event, employeeId: string, recorded: string, dailyLog: IDailyLog, date: string) => {
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

ipcMain.on('deleteDailyLog', async (event, id, date) => {
    try {
        validateDailyLogListInput(id);
        if (date) validateISODateFormatInput(date);
        await deleteFile(Path.join(getMonthDir(date), id));
    } catch (err) {
        errorLogger(err);
        if (err.name === 'invalidISODate') InvalidValueErr(err);
        ValidationDeleteErr(TYPE, err, id);
    }
});