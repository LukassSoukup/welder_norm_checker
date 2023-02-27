interface IOrder {
    orderNumber: string,
    dueDate: string,
    listOfProducts: IlistResponse,
    state: boolean
}

interface IProduct {
    articleNum: string;
    price: number;
    timeToComplete: string,
    detail?: string;
    amount?: number;
    originalAmount?: number;
}

interface IEmployee {
    name: string;
    id?: string;
}

interface IDailyLog {
    arrivedToWork: string;
    leftWork: string;
    normAccomplished: boolean;
    productList: IlistResponse;
    workTime?: number;
    recorded?: string;
}

interface IEmployeesDailyLog {
    employeeId: string;
    moneyEarned: number;
    normAccomplished: boolean;
    totalWorkTime: number;
    totalProductTime: number;
    dailyLog: IDailyLog[]
}

interface IProductAmountList {
    [productId: string]: number;
}

interface IlistResponse {
    [key: string]: any;
}