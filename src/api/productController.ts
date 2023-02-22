import {ipcMain} from "electron";
import {validateOrderCreateInput, validateOrderGetInput} from "../file_managament/Utils/inputValidation";
import {createFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import Path from "path";
import {ORDER_FILE_PATH} from "../file_managament/constants/file_paths";

ipcMain.on('createProduct', (event, order) => {
    validateOrderCreateInput(order);
    createFile(Path.join(ORDER_FILE_PATH, order.orderNumber), order);
});

ipcMain.handle('getProduct', async (event, orderName) => {
    validateOrderGetInput(orderName);
    return await loadFile(Path.join(ORDER_FILE_PATH, orderName));
});

ipcMain.handle('listProducts', async () => {
    return await loadFiles(Path.join(ORDER_FILE_PATH));
});

ipcMain.on('updateProduct', async (event, order) => {
    validateOrderGetInput(order.orderName);
    await updateFile(Path.join(ORDER_FILE_PATH, order.orderNumber), order);
});
