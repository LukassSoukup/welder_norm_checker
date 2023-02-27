import * as React from 'react';
import {OrderCreateForm} from "./GUI/OrderCreateForm";
import {OrderList} from "./GUI/OrderList";
import {EmployeeList} from "./GUI/EmployeeList";
import {EmployeeCreateForm} from "./GUI/EmployeeCreateForm";
import {useState} from "react";

const App = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const createEmployee = "createEmployee"
    const createOrder = "createOrder"
    const listEmployees = "listEmployees"
    const listOrder = "listOrder"

    const demoInsurance = new Date().toISOString() > "2023-03-31T14:48:00.000Z";
    if(demoInsurance) return <h1>Nadešel konec zkušební doby programu</h1>

    const openComponent = (componentName: string) => {
        setActiveComponent(componentName);
    }

    const closeComponent = () => {
        setActiveComponent(null);
    }

    const isThisActiveComponent = (componentName: string) => {
        return activeComponent === componentName;
    }

    return (
        <div>
            <button onClick={() => isThisActiveComponent(createEmployee) ? closeComponent() : openComponent(createEmployee)}>{isThisActiveComponent(createEmployee) ? "zavřít" : "Vytvořit zaměstnance"}</button>
            <button onClick={() => isThisActiveComponent(listEmployees) ? closeComponent() : openComponent(listEmployees)}>{isThisActiveComponent(listEmployees) ? "zavřít" : "Zobrazit zaměstnance"}</button>
            <button onClick={() => isThisActiveComponent(createOrder) ? closeComponent() : openComponent(createOrder)}>{isThisActiveComponent(createOrder) ? "zavřít" : "Vytvořit objednávku"}</button>
            <button onClick={() => isThisActiveComponent(listOrder) ? closeComponent() : openComponent(listOrder)}>{isThisActiveComponent(listOrder) ? "zavřít" : "Zobrazit objednávky"}</button>
            {isThisActiveComponent(createEmployee) ? <EmployeeCreateForm/> : null}
            {isThisActiveComponent(listEmployees) ? <EmployeeList/> : null}
            {isThisActiveComponent(createOrder) ? <OrderCreateForm/> : null}
            {isThisActiveComponent(listOrder) ? <OrderList/> : null}
        </div>
    )
}

export default App;