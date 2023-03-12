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
    amountByOrder?: number;
}

interface IEmployee {
    name: string;
    hourlyRate: number;
    assignedWork: IProductAmountList;
    assignedWorkTime: number;
    id?: string;
}

interface IDailyLog {
    normAccomplished?: boolean;
    productList: IlistResponse;
    workTime: number;
    productTime: number;
    normTime?: number;
    moneyEarned?: number;
    recorded?: string;
}

interface IEmployeesDailyLog {
    employeeId: string;
    moneyEarned: number;
    normAccomplished: boolean;
    totalNormTime: number;
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

interface ICurrencyAPIResponse {
    "date": string,
    "info": {
    "rate": number,
        "timestamp": number
},
    "query": {
    "amount": number,
        "from": string,
        "to": string
},
    "result": number,
    "success": boolean
}