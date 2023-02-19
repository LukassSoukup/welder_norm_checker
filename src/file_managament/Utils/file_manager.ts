import * as fs from "fs";
import * as fsAsync from "fs/promises";
import {validateUniqueFile} from "./file_validator";
import * as path from "path";

function createFile(filePath:string, content:string):void {
    // validate if path exist, if no create it
    // validate if fileName exists, if yes throw error
    try {
        validateUniqueFile(filePath);
        fs.writeFileSync(filePath, content);
    } catch(err) {
        console.error(err);
    }
}

function updateFile(filePath:string, content:string):void {
    // validate if fileName exists, if yes throw error
    // TODO UNFINISHED
    try {
        fs.writeFileSync(filePath, content);
    } catch(err) {
        console.error(err);
    }
}

function loadFile(filePath:string, callback: (obj:object)=> void) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Failed to read products file: ${err}`);
            callback(null);
            return;
        }
        try {
            const jsonData = JSON.parse(data.toString());
            callback(jsonData);
        } catch (err) {
            console.error(`Failed to parse products data: ${err}`);
            callback(null);
        }
    });
}

async function loadFiles(dirPath: string): Promise<{ name: string; content: string }[]> {
    const fileNames = await fsAsync.readdir(dirPath);

    return await Promise.all(fileNames.map(async (name) => {
        const content = await fsAsync.readFile(path.join(dirPath, name), { encoding: 'utf-8' });
        return { name, content };
    }));
}



export {createFile, loadFile, loadFiles}