import React, {useEffect, useState} from 'react';
import "./css/dailyLogList.css";
import "./css/general.css";
import {formatNumber, formatTime} from "../helpers/timeFormatHelper";

const initialEmployeeDailyLog: IEmployeesDailyLog = {
    employeeId: '',
    moneyEarned: 0,
    normAccomplished: false,
    totalNormTime: 0,
    totalWorkTime: 0,
    totalProductTime: 0,
    dailyLog: []
}
export const DailyLogList = ({employee, date}: { employee: IEmployee, date: string }) => {
    const [employeeDailyLog, setEmployeeDailyLog] = useState<IEmployeesDailyLog>(initialEmployeeDailyLog);

    useEffect(() => {
        if(date.length > 0) {
            window.DailyLog.listByEmployee(employee.id, date).then((data) => {
                if(!data) setEmployeeDailyLog(initialEmployeeDailyLog);
                else setEmployeeDailyLog(data);
            });
        }else {
            window.DailyLog.listByEmployee(employee.id).then((data) => {
                if(!data) setEmployeeDailyLog(initialEmployeeDailyLog);
                else setEmployeeDailyLog(data);
            });
        }
    }, [date]);

    if(employeeDailyLog.dailyLog.length === 0) return null;

    return (
        <div>
            <ul className="daily-log">
                <li>
                    <p className="total-work-time">Celková odpracovaná
                        doba: {formatTime(employeeDailyLog.totalWorkTime)}</p>
                    <p className="total-money-earned">Měsíční výdělek: {formatNumber(employeeDailyLog.moneyEarned)},-
                        Kč</p>
                    <p className="total-norm-time">Normu {employeeDailyLog.normAccomplished ?
                        <b className="norm-ok">splnil </b> : <b className="norm-not-ok">nesplnil </b>}
                        o {formatTime(Math.abs(employeeDailyLog.totalNormTime))}</p>
                </li>
                {employeeDailyLog.dailyLog.length > 0 && employeeDailyLog.dailyLog.map((log: IDailyLog) => (
                    <li key={log.recorded} className="log-per-day">
                        <p className="recorded">{new Date(log.recorded).toLocaleDateString()}</p>
                        <p className="work-time">Doba práce: {formatTime(log.workTime)}</p>
                        <p className="money-earned">Výdělek: {formatNumber(log.moneyEarned)},- Kč</p>
                        <p className="norm-time">Normu {log.normAccomplished ? <b className="norm-ok">splnil </b> :
                            <b className="norm-not-ok">nesplnil </b>} o {formatTime(Math.abs(log.normTime))}</p>
                        <ul className="log-product-list">
                            {Object.keys(log.productList).map((artikelNum: string) => (
                                <li key={artikelNum}
                                    className="amount-by-product">{artikelNum} {log.productList[artikelNum]} ks</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
