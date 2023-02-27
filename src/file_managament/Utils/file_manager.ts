import {promises as fs} from 'fs';
import {validateUniqueFile} from "./file_validator";
import * as path from "path";
import {debugLogger, errorLogger, infoLogger} from "../constants/file_paths";
import {dialog} from 'electron';

async function createFile(filePath: string, content: object): Promise<void> {
    filePath += ".json";
    try {
        validateUniqueFile(filePath);
        await fs.writeFile(filePath, JSON.stringify(content, null, 2));
        infoLogger(`File saved to ${filePath}`);
    } catch (err) {
        errorLogger(err);
        dialog.showErrorBox(`Chyba vytváření souboru ${getFileName(filePath)}`, err.message);
    }
}

async function updateFile(filePath: string, newContent: object): Promise<void> {
    filePath += ".json";
    try {
        await fs.writeFile(filePath, JSON.stringify(newContent, null, 2));
        infoLogger(`File updated in ${filePath}`);
    } catch (err) {
        errorLogger(err);
        dialog.showErrorBox(`Chyba úpravě souboru ${getFileName(filePath)}`, err.message);
    }
}

async function loadFile(filePath: string) {
    filePath += ".json";
    try {
        const data = await fs.readFile(filePath, "utf8");
        infoLogger(`Loading file from ${filePath}`);
        return JSON.parse(data.toString());
    } catch (err) {
        errorLogger(err);
        dialog.showErrorBox(`Chyba načítání souboru ${getFileName(filePath)}`, err.message);
    }
}

async function fileExists(filePath: string) {
    filePath += ".json";
    try {
        await fs.stat(filePath);
        return true;
    } catch (err) {
        return false
    }
}

async function loadFiles(dirPath: string): Promise<any> {
    try {
        const fileNames = await fs.readdir(dirPath);
        const response: any = [];
        await Promise.all(fileNames.map(async (name: string) => {
            let content = await fs.readFile(path.join(dirPath, name), {encoding: 'utf-8'});
            content = JSON.parse(content.toString());
            response.push(content);
        }));
        if (response.length === 0) debugLogger(`No records found at ${dirPath}`);
        else infoLogger(`Loading multiple files from ${dirPath}`);
        return response;
    } catch (err) {
        errorLogger(err);
        dialog.showErrorBox(`Chyba načítání souborů`, err.message);
    }
}

async function deleteFile(filePath: string): Promise<void> {
    filePath += ".json";
    try {
        const fileExists = await fs.stat(filePath);
        if (!fileExists) throw new Error(`File ${filePath} does not exist!`);
        await fs.unlink(filePath);
        infoLogger(`Deleting file at ${filePath}`);
    } catch (err) {
        errorLogger(err);
        dialog.showErrorBox(`Chyba mazání souboru ${getFileName(filePath)}`, err.message);
    }
}

function getFileName(filePath: string): string {
    const fname = filePath.split("\\");
    return fname[fname.length - 1];
}

export {createFile, loadFile, loadFiles, updateFile, deleteFile, fileExists}