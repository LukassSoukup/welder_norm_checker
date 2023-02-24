import {isRequiredButMissingErr} from "../constants/file_paths";

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
    if(!obj.timeToComplete) throw isRequiredButMissingErr("Product.timeToComplete");
}
export function validateProductGetInput(articleNum: string): void {
    if(!articleNum) throw isRequiredButMissingErr("Product.articleNum");
}

export function validateEmployeeInput(obj: IEmployee): void {
    if(!obj.name) throw isRequiredButMissingErr("Employee.name");
}

export function validateDailyLogInput(obj: IDailyLog): void {
    if(!obj.employeeId) throw isRequiredButMissingErr("DailyLog.employeeId");
    if(!obj.workTime) throw isRequiredButMissingErr("DailyLog.workTime");
    if(!obj.productList) throw isRequiredButMissingErr("DailyLog.productList");
}

