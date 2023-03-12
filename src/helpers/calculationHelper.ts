export function calculateEmployeeWorkAllocation(employeeList: IEmployee[]): IProductAmountList {
    const allocatedWork: IProductAmountList = {};
    employeeList.forEach((employee: IEmployee) => {
        for(const articleNum in employee.assignedWork) {
            if(!allocatedWork[articleNum]) allocatedWork[articleNum] = employee.assignedWork[articleNum];
            else allocatedWork[articleNum] += employee.assignedWork[articleNum];
        }
    });
    return allocatedWork;
}

export function calculateRemainingProductAmountsForWorkAllocation(productList: IProduct[], allocatedWork: IProductAmountList): IProductAmountList {
    const remainingProductAmount: IProductAmountList = {};
    productList.forEach(product => remainingProductAmount[product.articleNum] = product.amount);
    for(const articleNum in allocatedWork) {
        remainingProductAmount[articleNum] -= allocatedWork[articleNum];
    }
    return remainingProductAmount;
}
