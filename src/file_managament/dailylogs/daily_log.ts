export class DailyLog {
    private employeeId: string;
    private workTime: number;
    private productList: object;
    private date: string;
    constructor(employeeId:string, workTime:number, productList:object) {
        this.employeeId = employeeId;
        this.workTime = workTime;
        this.productList = productList;
        this.date = new Date().toLocaleDateString();
    }
}