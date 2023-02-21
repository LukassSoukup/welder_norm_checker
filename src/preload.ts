// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    notificationApi: {
        sendNotification (message: string) {
            ipcRenderer.send("notify", message);
        },
    },
});
// ipcRenderer.send is used to send a message to the main process ->
// ipcRenderer.invoke is used to send a message and wait for a response from the main process <->

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title: string) => ipcRenderer.send('set-title', title)
})