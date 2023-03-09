import {isRequiredButMissingErr} from "../constants/file_paths";
import {isIsoDate} from "./calculationHelper";

export function validateOrderCreateInput(obj: IOrder): void {
    if(!obj.orderNumber) throw isRequiredButMissingErr("Order.orderNumber");
    if(!obj.dueDate) throw isRequiredButMissingErr("Order.dueDate");
    if(!obj.listOfProducts) throw isRequiredButMissingErr("Order.listOfProducts");
}
export function validateOrderGetInput(orderNumber: string): void {
    if(!orderNumber) throw isRequiredButMissingErr("Order.orderNumber");
}

export function validateProductCreateInput(obj: IProduct): void {
    if(!obj.articleNum) throw isRequiredButMissingErr("Product.articleNum");
    if(!obj.price) throw isRequiredButMissingErr("Product.price");
    if(!obj.timeToComplete) throw isRequiredButMissingErr("Product.timeToComplete");
}
export function validateProductGetInput(articleNum: string): void {
    if(!articleNum) throw isRequiredButMissingErr("Product.articleNum");
}

export function validateEmployeeInput(obj: IEmployee): void {
    if(!obj.name) throw isRequiredButMissingErr("Employee.name");
    if(!obj.hourlyRate) throw isRequiredButMissingErr("Employee.hourlyRate");
}
export function validateEmployeeGetInput(id: string): void {
    if(!id) throw isRequiredButMissingErr("Employee.id");
}

export function validateDailyLogAddInput(employee: IEmployee, obj: IDailyLog): void {
    if(!employee.id) throw isRequiredButMissingErr("employeeId");
    if(!employee.hourlyRate) throw isRequiredButMissingErr("employee.hourlyRate");
    if(!obj.workTime) throw isRequiredButMissingErr("DailyLog.workTime");
    if(!obj.productTime) throw isRequiredButMissingErr("DailyLog.productTime");
    if(!obj.productList) throw isRequiredButMissingErr("DailyLog.productList");
}

export function validateDailyLogGetInput(employeeId: string, recorded: string /*ISOString*/): void {
    if(!employeeId) throw isRequiredButMissingErr("DailyLog.employeeId");
    if(!recorded) throw isRequiredButMissingErr("DailyLog.recorded");
}

export function validateDailyLogListInput(employeeId: string): void {
    if(!employeeId) throw isRequiredButMissingErr("DailyLog.employeeId");
}

export function validateISODateFormatInput(date: string): void {
    if(!isIsoDate(date)) {
        const e = new Error(`Date ${date} is not valid ISO format.`);
        e.name = "invalidISODate";
        throw e;
    }
}