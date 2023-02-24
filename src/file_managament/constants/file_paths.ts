import {dialog} from "electron";

export const EMPLOYEE_FILE_PATH = __dirname + "/../../storage/zamestnanci";
export const ORDER_FILE_PATH = __dirname + "/../../storage/zakazky";
export const PRODUCT_FILE_PATH = __dirname + "/../../storage/produkty";
export const DAILY_LOG_FILE_PATH = __dirname + "/../../storage/zaznamy_prace";

export const isRequiredButMissingErr = (type: string) => new Error(`${type} is required but is missing`);

export const ValidationCreateErr = (type: string, errMsg: Error, file: string) => dialog.showErrorBox(`Chyba validace vytváření ${type} ${file}`, errMsg.message);
export const ValidationUpdateErr = (type: string, errMsg: Error, file: string) => dialog.showErrorBox(`Chyba validace úprava ${type} ${file}`, errMsg.message);
export const ValidationGetErr = (type: string, errMsg: Error, file: string) => dialog.showErrorBox(`Chyba validace načtení ${type} ${file}`, errMsg.message);
export const ValidationDeleteErr = (type: string, errMsg: Error, file: string) => dialog.showErrorBox(`Chyba validace odmazání ${type} ${file}`, errMsg.message);
export const InvalidValueErr = (errMsg: Error) => dialog.showErrorBox(`Invalid value!`, errMsg.message);

export const infoLogger = (msg: string) => console.info("[INFO]: ", msg);
export const debugLogger = (msg: string) => console.debug("[DEBUG]: ", msg);
export const errorLogger = (msg: string) => console.error("[ERROR]: ", msg);
