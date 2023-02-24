import {ipcMain} from "electron";
import {
    validateProductGetInput, validateProductCreateInput,
} from "../file_managament/Utils/inputValidation";
import {createFile, deleteFile, loadFile, loadFiles, updateFile} from "../file_managament/Utils/file_manager";
import Path from "path";
import {
    errorLogger,
    PRODUCT_FILE_PATH, ValidationCreateErr,
    ValidationDeleteErr,
    ValidationGetErr,
    ValidationUpdateErr
} from "../file_managament/constants/file_paths";

const TYPE = "produktu";
ipcMain.on('createProduct', async (event, product) => {
    try {
        validateProductCreateInput(product);
        await createFile(Path.join(PRODUCT_FILE_PATH, product.articleNum), product);
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

ipcMain.handle('listProducts', async () => {
    return await loadFiles(Path.join(PRODUCT_FILE_PATH));
});

ipcMain.on('updateProduct', async (event, product) => {
    try {
        validateProductGetInput(product.articleNum);
        const fpath = Path.join(PRODUCT_FILE_PATH, product.articleNum);
        const oldProduct = await loadFile(fpath);
        await updateFile(fpath, {...oldProduct, ...product});
    } catch (err) {
        errorLogger(err);
        ValidationUpdateErr(TYPE, err, product.articleNum);
    }
});

ipcMain.on('deleteProduct', async (event, articleNum) => {
    try {
        validateProductGetInput(articleNum);
        await deleteFile(Path.join(PRODUCT_FILE_PATH, articleNum));
    } catch (err) {
        errorLogger((err));
        ValidationDeleteErr(TYPE, err, articleNum);
    }
});
