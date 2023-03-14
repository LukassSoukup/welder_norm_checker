import {ipcMain} from "electron";
import Path from "path";
import {
    validateProductGetInput, validateProductCreateInput, validateProductAddAmount,
} from "../file_managament/Utils/inputValidation";
import {
    createFile,
    deleteFile,
    fileExists,
    loadFile,
    loadFiles,
    updateFile
} from "../file_managament/Utils/file_manager";
import {
    errorLogger,
    PRODUCT_FILE_PATH, ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";
import {listOrders, updateOrder} from "./orderController";

const TYPE = "produktu";
ipcMain.on('createProduct', async (event, product, byNewOrder?: boolean) => {
    try {
        validateProductCreateInput(product);
        const fpath = Path.join(PRODUCT_FILE_PATH, product.articleNum);
        if (byNewOrder) {
            const fileExist = await fileExists(fpath);
            if (fileExist) {
                const oldProduct: IProduct = await loadFile(fpath);
                product.amount += oldProduct.amount;
                return await updateFile(fpath, {...oldProduct, ...product});
            }
        }
        await createFile(fpath, product);
    } catch (err) {
        errorLogger(err);
        ValidationCreateErr(TYPE, err, product.articleNum);
    }
});

ipcMain.handle('getProduct', async (event, articleNum) => {
    try {
        validateProductGetInput(articleNum);
        return await loadFile(Path.join(PRODUCT_FILE_PATH, articleNum));
    } catch (err) {
        errorLogger(err);
        ValidationGetErr(TYPE, err, articleNum);
    }
});

ipcMain.handle('listProducts', async (): Promise<IProduct[]> => {
    const data = await loadFiles(Path.join(PRODUCT_FILE_PATH));
    return data.sort((a: IProduct, b: IProduct) => (a.articleNum.toLowerCase() > b.articleNum.toLowerCase()) ? 1 : ((b.articleNum.toLowerCase() > a.articleNum.toLowerCase()) ? -1 : 0));
});

ipcMain.on('updateProduct', async (event, product) => {
    // TODO on timeToComplete update recalculate everywhere totalWorkTime, workTime
    // TODO if newAmount < product.amout check all work allocation and make sure the update is possible without messing up the data
    await updateProduct(product);
});

ipcMain.on('addAmount', async (event, id: string, amount: number) => {
    try {
        validateProductAddAmount(id, amount);
        const fpath = Path.join(PRODUCT_FILE_PATH, id);
        const fileExist = await fileExists(fpath);
        if (fileExist) {
            const product: IProduct = await loadFile(fpath);
            product.amount += amount;
            return await updateFile(fpath, product);
        }
        const err = new Error(`Product ${id} does not exist`);
        errorLogger(err.message);
        ValidationUpdateErr(TYPE, err, id);
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, id);
    }
});

ipcMain.handle('productExists', (event, articleNum) => {
    validateProductGetInput(articleNum);
    return fileExists(Path.join(PRODUCT_FILE_PATH, articleNum));
});
ipcMain.on('deleteProduct', async (event, articleNum) => {
    try {
        validateProductGetInput(articleNum);
        const orders = await listOrders();
        const changedOrders: IOrder[] = [];
        orders.forEach((order: IOrder) => {
            if (order.listOfProducts[articleNum]) {
                delete order.listOfProducts[articleNum];
                changedOrders.push(order);
            }
        })
        changedOrders.forEach((order: IOrder) => {
            updateOrder(event, order);
        })
        await deleteFile(Path.join(PRODUCT_FILE_PATH, articleNum));
    } catch (err) {
        errorLogger((err));
        ValidationDeleteErr(TYPE, err, articleNum);
    }
});

export async function updateProduct(product: IProduct) {
    try {
        validateProductGetInput(product.articleNum);
        const fpath = Path.join(PRODUCT_FILE_PATH, product.articleNum);
        const oldProduct = await loadFile(fpath);
        await updateFile(fpath, {...oldProduct, ...product});
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, product.articleNum);
    }
}