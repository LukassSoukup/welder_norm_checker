import {ipcMain} from "electron";
import {validateOrderCreateInput, validateOrderGetInput} from "../file_managament/Utils/inputValidation";
import {createFile, deleteFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import Path from "path";
import {ORDER_FILE_PATH} from "../file_managament/constants/file_paths";

ipcMain.on('createOrder', (event, order) => {
    validateOrderCreateInput(order);
    createFile(Path.join(ORDER_FILE_PATH, order.orderNumber), order);
});

ipcMain.handle('getOrder', async (event, orderNumber) => {
    validateOrderGetInput(orderNumber);
    return await loadFile(Path.join(ORDER_FILE_PATH, orderNumber));
});

ipcMain.handle('listOrders', async () => {
    return await loadFiles(Path.join(ORDER_FILE_PATH));
});

ipcMain.on('updateOrder', async (event, order) => {
    validateOrderGetInput(order.orderName);
    await updateFile(Path.join(ORDER_FILE_PATH, order.orderNumber), order);
});

ipcMain.on('deleteOrder', async (event, orderNumber) => {
    validateOrderGetInput(orderNumber);
    await deleteFile(Path.join(ORDER_FILE_PATH, orderNumber));
});
