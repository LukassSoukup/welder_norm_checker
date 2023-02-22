import {Product} from "./product";
import {loadFile} from "../Utils/file_manager";
import {ORDER_FILE_PATH} from "../constants/file_paths";
import * as path from "path";

export class Order {
   private orderNumber: string;
    private dueDate: string;
    private listOfProducts: Product[];
    private state: boolean;
    constructor(orderNumber:string, dueDate:string, listOfProducts:Product[], state:boolean) {
        this.orderNumber = orderNumber;
        this.dueDate = dueDate;
        this.listOfProducts = listOfProducts;
        this.state = state;
    }

    private loadProducts(jsonData: any) {
        jsonData.map((productData: any) => {
            this.listOfProducts.push(new Product(productData.articleNum, productData.amount, productData.detail));
        });
    }
    toJSON() {
        return {
            orderNumber: this.orderNumber,
            dueDate: this.dueDate,
            listOfProducts: this.listOfProducts,
            state: this.state,
        }
    }
    public load() {
        loadFile(path.join(ORDER_FILE_PATH, this.orderNumber), this.loadProducts);
    }
    
    public addProductToOrder(product:Product) {
        this.listOfProducts.push(product);
    }
    get getListOfProducts(): Product[] {
        return this.listOfProducts;
    }
    get getOrderNumber(): string {
        return this.orderNumber;
    }
    set setOrderNumber(value: string) {
        this.orderNumber = value;
    }
    get getDueDate(): string {
        return this.dueDate;
    }
    set setDueDate(value: string) {
        this.dueDate = value;
    }
    get getState(): boolean {
        return this.state;
    }

    set setState(value: boolean) {
        this.state = value;
    }
}