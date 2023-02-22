import { promises as fs } from 'fs';
import {validateUniqueFile} from "./file_validator";
import * as path from "path";
import {errorLogger, infoLogger} from "../constants/file_paths";

async function createFile(filePath: string, content: object): Promise<void> {
    filePath += ".json";
    try {
        validateUniqueFile(filePath);
        await fs.writeFile(filePath, JSON.stringify(content, null, 2));
        infoLogger(`File saved to ${filePath}`);
    } catch (err) {
        errorLogger(err);
    }
}

async function updateFile(filePath: string, newContent: object): Promise<void> {
    filePath += ".json";
    try {
        const obj = await loadFile(filePath);
        await fs.writeFile(filePath, {...obj, ...newContent});
    } catch (err) {
        errorLogger(err);
    }
}

async function loadFile(filePath: string) {
    filePath += ".json";
    try {
        const data = await fs.readFile(filePath, "utf8");
        infoLogger(`Loading data from ${filePath}\n${data}`);
        return JSON.parse(data.toString());
    } catch (err) {
        errorLogger(err);
    }
}
async function loadFiles(dirPath: string): Promise<IlistResponse> {
    try {
    const fileNames = await fs.readdir(dirPath);
    const response:IlistResponse = {};
    await Promise.all(fileNames.map(async (name: string) => {
        let content = await fs.readFile(path.join(dirPath, name), {encoding: 'utf-8'});
        content = JSON.parse(content.toString());
        response[name.split('.')[0]] = content;
    }));
    return response;
    } catch (err) {
        errorLogger(err);
    }
}

async function deleteFile(filePath: string): Promise<void> {
    filePath += ".json";
    try {
        const fileExists = await fs.stat(filePath);
        if(!fileExists) throw new Error(`File ${filePath} does not exist!`);
        await fs.unlink(filePath);
    } catch (err) {
        errorLogger(err);
    }
}



export {createFile, loadFile, loadFiles, updateFile, deleteFile}