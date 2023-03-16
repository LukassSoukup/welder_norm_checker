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
    const btnColor = 'lightblue';

    useEffect(() => {
        getEmployeeList();
    }, []);

    const getEmployeeList = () => {
        window.Employee.list().then((data) => {
            setEmployeeList(data);
        });
    }
    const forceUpdateFn = () => {
        setTimeout(() => getEmployeeList(), 600);
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
    const hasWorkAssigned = (employee: IEmployee): boolean => {
        if (Object.keys(employee.assignedWork).length === 0) return false;
        let workAmount = 0;
        for (const articleNum in employee.assignedWork) {
            workAmount += employee.assignedWork[articleNum];
        }
        return workAmount > 0;
    }


    return (
        <div>
            <ul className="employee-list">
                {employeeList.length > 0 && employeeList.map((employee: IEmployee) => (
                    <li key={employee.id} className="employee-item">
                        <div className="employee-details">
                            <h2 className="employee-number">{employee.name}</h2>
                            <i className="employee-hourly-rate">{formatNumber(employee.hourlyRate)},- Kč/h</i>
                            {Object.keys(employee.assignedWork).length > 0 && Object.keys(employee.assignedWork).map((articleNum: string) => {
                                if (employee.assignedWork[articleNum] === 0) return null;
                                return <i><b>{articleNum}:</b> {employee.assignedWork[articleNum]} ks</i>
                            })}
                            {hasWorkAssigned(employee) ?
                                <i><b>Doba práce:</b> {formatTime(employee.assignedWorkTime)}</i> : null}
                        </div>
                        <div className="employee-buttons">
                            <button className="assign-work-btn" style={{backgroundColor: `${isActiveBtn(employee.id, assignWork)? btnColor : ''}`}}
                                    onClick={() => setActionBtn(employee.id, assignWork)}><h3>{isActiveBtn(employee.id, assignWork) ? "Zavřít" : "Přiřadit práci"}</h3></button>
                            <button className="create-log-btn" style={{backgroundColor: `${isActiveBtn(employee.id, dailyLogCreate)? btnColor : ''}`}}
                                    onClick={() => setActionBtn(employee.id, dailyLogCreate)}><h3>{isActiveBtn(employee.id, dailyLogCreate) ? "Zavřít" : "Vykázat práci"}</h3></button>
                            <button className="list-log-btn" style={{backgroundColor: `${isActiveBtn(employee.id, dailyLogList)? btnColor : ''}`}}
                                    onClick={() => setActionBtn(employee.id, dailyLogList)}><h3>{isActiveBtn(employee.id, dailyLogList) ? "Zavřít" : "Zobrazit práci"}</h3></button>
                        </div>
                        <div className="employee-control-panel">
                            {isActiveBtn(employee.id, assignWork) ?
                                <AssignWorkToEmployee allocatedWork={calculateEmployeeWorkAllocation(employeeList)}
                                                      employee={employee} forceUpdateFn={forceUpdateFn}/> : null}
                            {isActiveBtn(employee.id, dailyLogCreate) ?
                                <DailyLogCreateForm employee={employee} forceUpdateFn={forceUpdateFn}/> : null}
                            {isActiveBtn(employee.id, dailyLogList) ? <DailyLogList employee={employee}/> : null}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const AssignWorkToEmployee = ({
                                         allocatedWork,
                                         employee,
                                         forceUpdateFn
                                     }: { allocatedWork: IProductAmountList, employee: IEmployee, forceUpdateFn: () => void }) => {
    const [amountToDo, setAmountToDo] = useState<IProductAmountList>({});
    const [selectedProductList, setSelectedProductList] = useState<IProduct[]>([]);

    const confirmBtn = () => {
        window.Employee.assignWork(employee.id, amountToDo);
        forceUpdateFn()
        setSelectedProductList([]);
        setAmountToDo({});
    }
    return (
        <div className="assign-work-section">
            <TextInputWithWhisperer setAmountDone={setAmountToDo} setSelectedProductList={setSelectedProductList}
                                    allocatedWork={allocatedWork}/>
            <br/>
            <ul className={selectedProductList.length > 0 ? "selected-product-list" : ''}>
                {selectedProductList.length > 0 && selectedProductList.map(product => (
                    <li className="selected-product"
                        key={product.articleNum}>{product.articleNum} {amountToDo[product.articleNum]} ks</li>
                ))}
            </ul>
            <button disabled={selectedProductList.length === 0} onClick={() => confirmBtn()}
                    className="send-btn">Přiřadit
            </button>
        </div>
    )
}