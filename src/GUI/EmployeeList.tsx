import React, {useEffect, useState} from 'react';
import {DailyLogCreateForm} from "./DailyLogCreateForm";

export const EmployeeList = () => {
    const [employeeList, setEmployeeList] = useState<IlistResponse>({});
    const [activeEmployee, setActiveEmployee] = useState('');
    const openCreateMenu = (id: string) => {
        setActiveEmployee(id);
    }

    const closeCreateMenu = () => {
        setActiveEmployee(null);
    }

    const isActiveEmployee = (id: string) => {
        return activeEmployee === id;
    }
    useEffect(() => {
        window.Employee.list().then((data) => {
            console.log(data);
            setEmployeeList(data);
        });
    }, []);

    return (
        <div>
            <ul className="employee-list">
                {Object.keys(employeeList).length > 0 && employeeList.map((employee: IEmployee) => (
                    <li key={employee.id} className="employee-item">
                        <h2 className="employee-number">{employee.name}</h2>
                        <label>
                            <button
                                onClick={() => isActiveEmployee(employee.id) ? closeCreateMenu() : openCreateMenu(employee.id)}>{isActiveEmployee(employee.id) ? "Zavřít" : "Vykázat práci"}</button>
                        </label>
                        {isActiveEmployee(employee.id) ? <DailyLogCreateForm employee={employee}/> : null}
                    </li>
                ))}
            </ul>
        </div>
    );
};
