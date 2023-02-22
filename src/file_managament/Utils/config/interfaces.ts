interface IOrder {
    orderNumber: string,
    dueDate: string,
    listOfProducts: IProduct[],
    state: boolean
}

interface IProduct {
    articleNum: string;
    amount: number;
    timeToComplete: string,
    detail: string | void;
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