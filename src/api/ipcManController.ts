import {BrowserWindow, ipcMain, Notification} from "electron";

ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
});

ipcMain.on("notify", (_, message) => {
    const notification = new Notification({title: "Notification", body: message});
    notification.show();
});

ipcMain.handle("ping", () => {
    console.log("ping recieved", process.versions.node);
    return "pong";
})