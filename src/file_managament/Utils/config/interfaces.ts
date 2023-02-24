interface IOrder {
    orderNumber: string,
    dueDate: string,
    listOfProducts: IProduct[],
    state: boolean
}

interface IProduct {
    articleNum: string;
    price: number;
    timeToComplete: string,
    detail?: string;
    amount?: number
}

interface IEmployee {
    name: string;
    id?: string;
}

interface IDailyLog {
    employeeId: string;
    arrivedToWork: string;
    leftWork: string;
    workTime?: number;
    productList: object;
}

interface IlistResponse {
    [key: string]: any;
}