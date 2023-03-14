import {ipcMain} from "electron";
import {LICENCE_KEY_PATH} from "../file_managament/constants/file_paths";
import {LICENCE_KEY} from "../file_managament/constants/currency";
import {promises as fs} from "fs";

ipcMain.handle('checkLicenceKey', async (event, key: string) => {
    if(LICENCE_KEY === key) fs.writeFile(LICENCE_KEY_PATH, LICENCE_KEY);
});
ipcMain.handle('loadLicenceKey', async (): Promise<string> => {
    return await fs.readFile(LICENCE_KEY_PATH, "utf8");
});
