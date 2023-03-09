import {ipcMain, IpcMainEvent} from "electron";
import {validateOrderCreateInput, validateOrderGetInput} from "../file_managament/Utils/inputValidation";
import {
    createFile,
    deleteFile,
    fileExists,
    loadFile,
    loadFiles,
    updateFile
} from "../file_managament/Utils/file_manager";
import Path from "path";
import {
    errorLogger,
    ORDER_FILE_PATH,
    PRODUCT_FILE_PATH,
    ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";

const TYPE = "zakázky"

ipcMain.on('createOrder', async (event, order) => {
    try {
        validateOrderCreateInput(order);
        await createFile(Path.join(ORDER_FILE_PATH, order.orderNumber), order);
    } catch (err) {
        errorLogger(err);
        ValidationCreateErr(TYPE, err, order.orderNumber);
    }
});

ipcMain.handle('getOrder', async (event, orderNumber) => {
    try {
        validateOrderGetInput(orderNumber);
        const order = await loadFile(Path.join(ORDER_FILE_PATH, orderNumber));
        return order.listOfProducts.map(async (articleNum: string) => {
            return await loadFile(Path.join(PRODUCT_FILE_PATH, articleNum));
        });
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, orderNumber);
    }
});
ipcMain.handle('orderExists', (event, orderNumber) => {
    validateOrderGetInput(orderNumber);
    return fileExists(Path.join(ORDER_FILE_PATH, orderNumber));
});
ipcMain.handle('listOrders', async () => {
    return await listOrders();
});

ipcMain.on('updateOrder', async (event, order) => {
    await updateOrder(event, order);
});

ipcMain.on('deleteOrder', async (event, orderNumber) => {
    try {
        validateOrderGetInput(orderNumber);
        await deleteFile(Path.join(ORDER_FILE_PATH, orderNumber));
    } catch (err) {
        errorLogger(err);
        ValidationDeleteErr(TYPE, err, orderNumber);
    }
});

export async function listOrders() {
    const orderList = await loadFiles(Path.join(ORDER_FILE_PATH));
    return Promise.all(orderList.map(async (order: IOrder) => {
        const productAmounts = order.listOfProducts;
        order.listOfProducts = [];
        for (const articleNum in productAmounts) {
            const product = await loadFile(Path.join(PRODUCT_FILE_PATH, articleNum));
            order.listOfProducts.push({...product, amountByOrder: productAmounts[articleNum]});
        }
        return order;
    }));
}

export async function updateOrder(event: IpcMainEvent, order: IOrder) {
    try {
        validateOrderGetInput(order.orderNumber);
        if(Array.isArray(order.listOfProducts)) {
            const list = order.listOfProducts;
            order.listOfProducts = {};
            list.forEach((product: IProduct) => {
                order.listOfProducts[product.articleNum] = product.amountByOrder;
            })
        }
        const fpath = Path.join(ORDER_FILE_PATH, order.orderNumber);
        const oldOrder = await loadFile(fpath);
        await updateFile(fpath, {...oldOrder, ...order});
    } catch (err) {
        errorLogger(err);
        ValidationGetErr(TYPE, err, order.orderNumber);
    }
}