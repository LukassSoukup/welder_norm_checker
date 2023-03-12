// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {ipcRenderer, contextBridge} from "electron";

// ipcRenderer.send is used to send a message to the main process ->
// ipcRenderer.invoke is used to send a message and wait for a response from the main process <->

contextBridge.exposeInMainWorld('Order', {
    create: (order: object) => ipcRenderer.send('createOrder', order),
    update: (order: object) => ipcRenderer.send('updateOrder', order),
    delete: (id: string) => ipcRenderer.send('deleteOrder', id),
    get: (id: string) => ipcRenderer.invoke('getOrder', id),
    list: () => ipcRenderer.invoke("listOrders"),
    exists: (id: string) => ipcRenderer.invoke("orderExists", id)
});

contextBridge.exposeInMainWorld('Product', {
    create: (product: IProduct, byNewOrder?: boolean) => ipcRenderer.send('createProduct', product, byNewOrder),
    update: (product: object) => ipcRenderer.send('updateProduct', product),
    addAmount: (id: string, amount: number) => ipcRenderer.send('addAmount', id, amount),
    delete: (id: string) => ipcRenderer.send('deleteProduct', id),
    get: (id: string) => ipcRenderer.invoke('getProduct', id),
    list: () => ipcRenderer.invoke("listProducts"),
    reportError: (id: string) => ipcRenderer.send("reportError", id),
    exists: (id: string) => ipcRenderer.invoke("productExists", id)
});

contextBridge.exposeInMainWorld('Employee', {
    create: (employee: object) => ipcRenderer.send('createEmployee', employee),
    update: (employee: object) => ipcRenderer.send('updateEmployee', employee),
    assignWork: (id: string, productAmountList: IProductAmountList) => ipcRenderer.send('assignWork', id, productAmountList),
    delete: (id: string) => ipcRenderer.send('deleteEmployee', id),
    get: (id: string) => ipcRenderer.invoke('getEmployee', id),
    list: () => ipcRenderer.invoke("listEmployees")
});

contextBridge.exposeInMainWorld('DailyLog', {
    add: (employee: IEmployee, dailyLog: IDailyLog, date?: string) => ipcRenderer.send('addDailyLog', employee, dailyLog, date),
    update: (employeeId: string, recorded: string, dailyLog: IDailyLog, date?: string) => ipcRenderer.send('updateDailyLog',employeeId, recorded, dailyLog, date),
    delete: (employeeId: string, date?: string) => ipcRenderer.send('deleteDailyLog', employeeId, date),
    get: (employeeId: string, recorded: string, date?: string) => ipcRenderer.invoke('getDailyLog', employeeId, recorded, date),
    listByEmployee: (employeeId: string, date?: string) => ipcRenderer.invoke("listLogsByMonthAndEmployee", employeeId, date),
    listAll: (date: string) => ipcRenderer.invoke("listAllLogsByMonth", date)
});