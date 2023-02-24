interface IOrder {
    orderNumber: string,
    dueDate: string,
    listOfProducts: IProduct[],
    state: boolean
}

interface IProduct {
    articleNum: string;
    timeToComplete: string,
    detail: string | void;
    amount?: number
}

interface IEmployee {
    name: string;
}

interface IDailyLog {
    employeeId: string;
    workTime: number;
    productList: object;
}

interface IlistResponse {
    [key: string]: any;
}