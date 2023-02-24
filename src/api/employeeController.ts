import {ipcMain} from "electron";
import {validateEmployeeGetInput, validateEmployeeInput} from "../file_managament/Utils/inputValidation";
import {createFile, deleteFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import Path from "path";
import {
    errorLogger,
    EMPLOYEE_FILE_PATH,
    ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";
import {randomUUID} from "crypto";
import {getMonthDir} from "../file_managament/Utils/calculationHelper";

const TYPE = "zaměstnance"

ipcMain.on('createEmployee', async (event, employee: IEmployee) => {
    try {
        validateEmployeeInput(employee);
        employee.id = randomUUID();
        await createFile(Path.join(EMPLOYEE_FILE_PATH, employee.id), employee);
        await createFile(Path.join(getMonthDir(), employee.id), {employeeId: employee.id, dailyLog: []});
    } catch (err) {
        errorLogger(err);
        ValidationCreateErr(TYPE, err, employee.name);
    }
});

ipcMain.handle('getEmployee', async (event, id) => {
    try {
        validateEmployeeGetInput(id);
        return await loadFile(Path.join(EMPLOYEE_FILE_PATH, id));
    } catch (err) {
        errorLogger(err);
        ValidationGetErr(TYPE, err, id);
    }
});

ipcMain.handle('listEmployees', async () => {
    return await loadFiles(Path.join(EMPLOYEE_FILE_PATH));
});

ipcMain.on('updateEmployee', async (event, employee) => {
    try {
        validateEmployeeGetInput(employee.id);
        const fpath = Path.join(EMPLOYEE_FILE_PATH, employee.id);
        const oldEmployee = await loadFile(fpath);
        await updateFile(fpath, {...oldEmployee, ...employee});
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, employee.id);
    }
});

ipcMain.on('deleteEmployee', async (event, id) => {
    try {
        validateEmployeeGetInput(id);
        await deleteFile(Path.join(EMPLOYEE_FILE_PATH, id));
    } catch (err) {
        errorLogger(err);
        ValidationDeleteErr(TYPE, err, id);
    }
});
