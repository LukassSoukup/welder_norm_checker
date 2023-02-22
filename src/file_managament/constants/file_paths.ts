export const EMPLOYEE_FILE_PATH = __dirname + "/../../storage/zamestnanci";
export const ORDER_FILE_PATH = __dirname + "/../../storage/zakazky";
export const PRODUCT_FILE_PATH = __dirname + "/../../storage/produkty";
export const DAILY_LOG_FILE_PATH = __dirname + "/../../storage/zaznamy_prace";

export const isRequiredButMissingErr = (type: string) => new Error(`${type} is required but is missing`);

export const infoLogger = (msg: string) => console.info("[INFO]: ", msg);
export const debugLogger = (msg: string) => console.debug("[DEBUG]: ", msg);
export const errorLogger = (msg: string) => console.error("[ERROR]: ", msg);
