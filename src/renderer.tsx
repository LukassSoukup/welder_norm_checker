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
        Order: {
            create: (obj: IOrder) => void;
            update: (obj: object) => void;
            delete: (id: string) => void;
            get: (id: string) => object;
            list: () => Promise<IlistResponse>;
            exists: (id: string) => Promise<boolean>;
        };
        Product: {
            create: (obj: IProduct, byNewOrder?:boolean) => void;
            update: (obj: IProduct) => void;
            addAmount: (id: string, amount: number) => void;
            delete: (id: string) => void;
            get: (id: string) => object;
            list: () => Promise<IProduct[]>;
            reportError: (id: string) => void;
            exists: (id: string) => Promise<boolean>;
        };
        Employee: {
            create: (obj: IEmployee) => void;
            update: (obj: object) => void;
            assignWork: (id: string, productAmountList: IProductAmountList) => void;
            delete: (id: string) => void;
            get: (id: string) => Promise<IEmployee>;
            list: () => Promise<IEmployee[]>;
        };
        DailyLog: {
            add: (employee: IEmployee, dailyLog: IDailyLog, date?: string) => void;
            update: (employeeId: string, recorded: string, dailyLog: IDailyLog, date?: string) => void;
            delete: (employeeId: string, date?: string) => void;
            get: (employeeId: string, recorded: string, date?: string) => object;
            listByEmployee: (employeeId: string, date?: string) => Promise<IEmployeesDailyLog>;
            listAll: (date: string) => Promise<IEmployeesDailyLog>[];
        };
        LicenceKey: {
            check: (key: string) => Promise<boolean>;
            load: () => Promise<string>;
        }
    }
}

import './index.css';
import React from 'react';
import {createRoot} from "react-dom/client";
import App from './app';

const root = createRoot(document.getElementById("root"));
root.render(<App/>);
