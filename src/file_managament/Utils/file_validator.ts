import * as fs from 'fs';
import Path from "path";

function createFilePath(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        // File does not exist, create it
        fs.mkdirSync(filePath, {recursive: true});
    }
}

function validateUniqueFile(filePath: string): void {
    const fileName = Path.basename(filePath);
    const dirPath = Path.dirname(filePath);
    const existingFiles = fs.readdirSync(dirPath);
    if (existingFiles.includes(fileName)) {
        throw new Error(`File ${fileName} already exists in directory ${dirPath}`);
    }
}

export {createFilePath, validateUniqueFile}