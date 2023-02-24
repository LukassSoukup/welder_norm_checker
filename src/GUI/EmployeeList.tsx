import React, {useEffect, useState} from 'react';

export const EmployeeList = () => {
    const [employeeList, setEmployeeList] = useState<IlistResponse>({});

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
                    </li>
                ))}
            </ul>
        </div>
    );
};
