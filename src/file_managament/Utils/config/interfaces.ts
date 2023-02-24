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
    arrivedToWork: string;
    leftWork: string;
    productList: object;
    workTime?: number;
    recorded?: string;
}

interface IEmployeesDailyLog {
    employeeId: string;
    dailyLog: IDailyLog[]
}

interface IlistResponse {
    [key: string]: any;
}