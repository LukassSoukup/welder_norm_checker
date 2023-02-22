import * as path from "path";
import {PRODUCT_FILE_PATH} from "../constants/file_paths";

export class Product {
    private articleNum: string;
    private amount: number;
    private detail: string | void;
    private timeToComplete: number;

    constructor(articleNum:string, amount: number, timeToComplete: number, detail: string | void) {
        this.articleNum = articleNum;
        this.amount = amount;
        this.timeToComplete = timeToComplete;
        this.detail = detail;
    }

    public getProduct(fileName:string) {
        const filePath = path.join(PRODUCT_FILE_PATH, fileName);
    }
    toJSON() {
        return {
            articleNum: this.articleNum,
            amount: this.amount,
            timeToComplete: this.timeToComplete,
            detail: this.detail,
        }
    }
}