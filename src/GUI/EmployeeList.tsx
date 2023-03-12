import React, {useEffect, useState} from 'react';
import {DailyLogCreateForm} from "./DailyLogCreateForm";
import {DailyLogList} from "./DailyLogList";
import {formatNumber, formatTime} from "../helpers/timeFormatHelper";
import TextInputWithWhisperer from "./TextInputWithWhisperer";
import {calculateEmployeeWorkAllocation} from "../helpers/calculationHelper";
import "./css/employeeList.css";
import "./css/general.css";

export const EmployeeList = () => {
    const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
    const [activeEmployee, setActiveEmployee] = useState([]);

    const dailyLogCreate = "dailyLogCreate";
    const dailyLogList = "dailyLogList";
    const assignWork = "assignWork";

    useEffect(() => {
        getEmployeeList();
    }, []);

    const getEmployeeList = () => {
        window.Employee.list().then((data) => {
            setEmployeeList(() => data);
        });
    }

    const openCreateMenu = (id: string, type: string) => {
        setActiveEmployee([id, type]);

    }
    const closeCreateMenu = () => {
        setActiveEmployee([]);

    }
    const isActiveBtn = (id: string, type: string) => {
        return activeEmployee[0] === id && activeEmployee[1] === type;
    }

    const setActionBtn = (id: string, type: string) => {
        if (isActiveBtn(id, type)) closeCreateMenu()
        else openCreateMenu(id, type)
    }
    return (
        <div>
            <ul className="employee-list">
                {employeeList.length > 0 && employeeList.map((employee: IEmployee) => (
                    <li key={employee.id} className="employee-item">
                        <div className="employee-details">
                            <h2 className="employee-number">{employee.name}</h2>
                            <i>{formatNumber(employee.hourlyRate)},- Kč/h</i>
                        </div>
                        {Object.keys(employee.assignedWork).length > 0 && Object.keys(employee.assignedWork).map((articleNum: string) => {
                            if (employee.assignedWork[articleNum] === 0) return null;
                            return (
                                <div>
                                    <p><b>{articleNum}:</b> {employee.assignedWork[articleNum]} ks</p>
                                    <p><b>Očekávaná doba práce:</b> {formatTime(employee.assignedWorkTime)}</p>
                                </div>
                            )
                        })}
                        <button className="assign-work-btn"
                                onClick={() => setActionBtn(employee.id, assignWork)}>{isActiveBtn(employee.id, assignWork) ? "Zavřít" : "Přiřadit práci"}</button>
                        <button className="create-log-btn"
                                onClick={() => setActionBtn(employee.id, dailyLogCreate)}>{isActiveBtn(employee.id, dailyLogCreate) ? "Zavřít" : "Vykázat práci"}</button>
                        <button className="list-log-btn"
                                onClick={() => setActionBtn(employee.id, dailyLogList)}>{isActiveBtn(employee.id, dailyLogList) ? "Zavřít" : "Zobrazit práci"}</button>
                        {isActiveBtn(employee.id, assignWork) ?
                            <AssignWorkToEmployee allocatedWork={calculateEmployeeWorkAllocation(employeeList)}
                                                  employee={employee} rerender={getEmployeeList}/> : null}
                        {isActiveBtn(employee.id, dailyLogCreate) ?
                            <DailyLogCreateForm employee={employee} rerender={getEmployeeList}/> : null}
                        {isActiveBtn(employee.id, dailyLogList) ? <DailyLogList employee={employee}/> : null}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const AssignWorkToEmployee = ({
                                         allocatedWork,
                                         employee,
                                         rerender
                                     }: { allocatedWork: IProductAmountList, employee: IEmployee, rerender: () => void }) => {
    const [amountToDo, setAmountToDo] = useState<IProductAmountList>({});
    const [selectedProductList, setSelectedProductList] = useState<IProduct[]>([]);

    const confirmBtn = () => {
        window.Employee.assignWork(employee.id, amountToDo);
        rerender();
    }
    return (
        <div>
            <TextInputWithWhisperer setAmountDone={setAmountToDo} setSelectedProductList={setSelectedProductList}
                                    allocatedWork={allocatedWork}/>
            <br/>
            <button disabled={selectedProductList.length === 0} onClick={() => confirmBtn()}
                    className="send-btn">Přiřadit
            </button>
        </div>
    )
}