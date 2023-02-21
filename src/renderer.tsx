/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
declare global {
    interface Window {
        electronAPI: {
            setTitle: (text:string) => void;
        };
        versions: {
            node: () => string;
            chrome: () => string;
            electron: () => string;
            ping: () => string;
            notificationApi: {
                sendNotification: (message: string) => void;
            }
        }
    }
}

import './index.css';
import React from 'react';
import {createRoot} from "react-dom/client";
import App from './app';

const root = createRoot(document.getElementById("root"));
root.render(<App/>);
