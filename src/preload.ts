// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {ipcRenderer, contextBridge} from "electron";

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    notificationApi: {
        sendNotification(message: string) {
            ipcRenderer.send("notify", message);
        },
    },
});
// ipcRenderer.send is used to send a message to the main process ->
// ipcRenderer.invoke is used to send a message and wait for a response from the main process <->

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title: string) => ipcRenderer.send('set-title', title)
})

contextBridge.exposeInMainWorld('Order', {
    create: (order: object) => ipcRenderer.send('createOrder', order),
    update: (order: object) => ipcRenderer.send('updateOrder', order),
    delete: (id: string) => ipcRenderer.send('deleteOrder', id),
    get: (id: string) => ipcRenderer.invoke('getOrder', id),
    list: () => ipcRenderer.invoke("listOrders")
});

contextBridge.exposeInMainWorld('Product', {
    create: (product: object) => ipcRenderer.send('createProduct', product),
    update: (product: object) => ipcRenderer.send('updateProduct', product),
    delete: (id: string) => ipcRenderer.send('deleteProduct', id),
    get: (id: string) => ipcRenderer.invoke('getProduct', id),
    list: () => ipcRenderer.invoke("listProducts")
});

contextBridge.exposeInMainWorld('Employee', {
    create: (employee: object) => ipcRenderer.send('createEmployee', employee),
    update: (employee: object) => ipcRenderer.send('updateEmployee', employee),
    delete: (id: string) => ipcRenderer.send('deleteEmployee', id),
    get: (id: string) => ipcRenderer.invoke('getEmployee', id),
    list: () => ipcRenderer.invoke("listEmployees")
});

contextBridge.exposeInMainWorld('DailyLog', {
    create: (dailyLog: object) => ipcRenderer.send('createDailyLog', dailyLog),
    update: (dailyLog: object) => ipcRenderer.send('updateDailyLog', dailyLog),
    delete: (id: string) => ipcRenderer.send('deleteDailyLog', id),
    get: (id: string) => ipcRenderer.invoke('getDailyLog', id),
    list: (employeeId: string) => ipcRenderer.invoke("listDailyLogsForEmployee", employeeId)
});