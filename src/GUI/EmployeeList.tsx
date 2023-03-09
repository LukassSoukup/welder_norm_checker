import React, {useEffect, useState} from 'react';
import {DailyLogCreateForm} from "./DailyLogCreateForm";
import {DailyLogList} from "./DailyLogList";
import "./css/employeeList.css";
import "./css/general.css";
import {formatNumber} from "../shared_resources/timeFormatHelper";

export const EmployeeList = () => {
    const [employeeList, setEmployeeList] = useState<IlistResponse>({});
    const [activeEmployee, setActiveEmployee] = useState([]);
    const dailyLogCreate = "dailyLogCreate";
    const dailyLogList = "dailyLogList";

    const openCreateMenu = (id: string, type: string) => {
        setActiveEmployee([id, type]);
    }

    const closeCreateMenu = () => {
        setActiveEmployee([]);
    }

    const isActiveBtn = (id: string, type: string) => {
        return activeEmployee[0] === id && activeEmployee[1] === type;
    }
    useEffect(() => {
        window.Employee.list().then((data) => {
            console.log(data);
            setEmployeeList(data);
        });
    }, []);

    const setActionBtn = (id: string, type: string) => {
        if (isActiveBtn(id, type)) closeCreateMenu()
        else openCreateMenu(id, type)
    }
    return (
        <div>
            <ul className="employee-list">
                {Object.keys(employeeList).length > 0 && employeeList.map((employee: IEmployee) => (
                    <li key={employee.id} className="employee-item">
                        <div className="employee-details">
                            <h2 className="employee-number">{employee.name}</h2>
                            <i>{formatNumber(employee.hourlyRate)},- Kč/h</i>
                        </div>
                        <button className="create-log-btn"
                            onClick={() => setActionBtn(employee.id, dailyLogCreate)}>{isActiveBtn(employee.id, dailyLogCreate) ? "Zavřít" : "Vykázat práci"}</button>
                        <button className="list-log-btn"
                            onClick={() => setActionBtn(employee.id, dailyLogList)}>{isActiveBtn(employee.id, dailyLogList) ? "Zavřít" : "Zobrazit práci"}</button>
                        {isActiveBtn(employee.id, dailyLogCreate) ? <DailyLogCreateForm employee={employee}/> : null}
                        {isActiveBtn(employee.id, dailyLogList) ? <DailyLogList employee={employee}/> : null}
                    </li>
                ))}
            </ul>
        </div>
    );
};
