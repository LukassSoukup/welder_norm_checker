import * as path from "path";
import {PRODUCT_FILE_PATH} from "../constants/file_paths";

export class Product {
    private articleNum: string;
    private amount: number;
    private detail: string | void;
    constructor(articleNum:string, amount: number, detail: string | void) {
        this.articleNum = articleNum;
        this.amount = amount;
        this.detail = detail;
    }

    public getProduct(fileName:string) {
        const filePath = path.join(PRODUCT_FILE_PATH, fileName);
    }
    toJSON() {
        return {
            articleNum: this.articleNum,
            amount: this.amount,
            detail: this.detail,
        }
    }
}