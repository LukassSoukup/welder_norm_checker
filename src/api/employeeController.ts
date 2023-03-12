import {ipcMain} from "electron";
import {
    validateEmployeeAssignWorkInput,
    validateEmployeeGetInput,
    validateEmployeeInput
} from "../file_managament/Utils/inputValidation";
import {createFile, deleteFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import Path from "path";
import {
    errorLogger,
    EMPLOYEE_FILE_PATH,
    ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr, PRODUCT_FILE_PATH
} from "../file_managament/constants/file_paths";
import {randomUUID} from "crypto";
import {
    calculateAssignWorkTime,
    ensureWorkAllocationNotExceedingProductAmount,
    getMonthDir
} from "../file_managament/Utils/calculationHelper";

const TYPE = "zaměstnance"

ipcMain.on('createEmployee', async (event, employee: IEmployee) => {
    try {
        validateEmployeeInput(employee);
        employee.id = randomUUID();
        await createFile(Path.join(EMPLOYEE_FILE_PATH, employee.id), employee);
        await createFile(Path.join(getMonthDir(), employee.id), {employeeId: employee.id, moneyEarned: 0, dailyLog: []});
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
    const data = await loadFiles(Path.join(EMPLOYEE_FILE_PATH));
    return data.sort((a: IEmployee, b: IEmployee) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
});

ipcMain.on('updateEmployee', async (event, employee) => {
    updateEmployee(employee);
});

ipcMain.on('assignWork', async (event, id: string, productAmountList: IProductAmountList) => {
    try {
        validateEmployeeAssignWorkInput(id, productAmountList);
        let employeeList: IEmployee[] = await loadFiles(Path.join(EMPLOYEE_FILE_PATH));
        const employee: IEmployee = employeeList.find((emp) => emp.id === id);
        const products: IProduct[] = await loadFiles(Path.join(PRODUCT_FILE_PATH));
        for(const articleNum in productAmountList) {
            if(!employee.assignedWork[articleNum]) employee.assignedWork[articleNum] = productAmountList[articleNum];
            else employee.assignedWork[articleNum] += productAmountList[articleNum];
            employee.assignedWorkTime += calculateAssignWorkTime(products.find(p => p.articleNum === articleNum), employee.assignedWork[articleNum]);
        }
        employeeList = employeeList.filter((emp) => emp.id !== id);
        employeeList.push(employee);
        ensureWorkAllocationNotExceedingProductAmount(employeeList, products);
        await updateFile(Path.join(EMPLOYEE_FILE_PATH, id), employee);
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, id);
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

export async function updateEmployee(employee: IEmployee) {
    try {
        validateEmployeeGetInput(employee.id);
        const fpath = Path.join(EMPLOYEE_FILE_PATH, employee.id);
        const oldEmployee = await loadFile(fpath);
        await updateFile(fpath, {...oldEmployee, ...employee});
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, employee.id);
    }
}