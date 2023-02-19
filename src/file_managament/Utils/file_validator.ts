import * as fs from 'fs';
import * as path from "path";

function createFilePath(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        // File does not exist, create it
        fs.mkdirSync(filePath, { recursive: true });
    }
}

function validateUniqueFile(filePath:string):void {
    const fileName = path.basename(filePath);
    const dirPath = path.dirname(filePath);
    const existingFiles = fs.readdirSync(dirPath);
    if (existingFiles.includes(fileName)) {
        throw new Error(`File ${fileName} already exists in directory ${dirPath}`);
    }
}

export {createFilePath, validateUniqueFile}