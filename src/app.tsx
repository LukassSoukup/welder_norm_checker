import {useState} from "react";
import {OrderCreateForm} from "./GUI/OrderCreateForm";
import {OrderList} from "./GUI/OrderList";
import {EmployeeList} from "./GUI/EmployeeList";
import {EmployeeCreateForm} from "./GUI/EmployeeCreateForm";
import {ProductCreateForm} from "./GUI/ProductCreateForm";
import {ProductList} from "./GUI/ProductList";
import {DEFAULT_COMPANY_HOURLY_RATE} from "./file_managament/constants/currency";
import "./GUI/css/app.css";
const App = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const createEmployee = "createEmployee"
    const createOrder = "createOrder"
    const createProduct = "createProduct"
    const listEmployees = "listEmployees"
    const listOrder = "listOrder"
    const listProduct = "listProduct"

    const demoInsurance = new Date().toISOString() > "2023-03-31T14:48:00.000Z";
    if(demoInsurance) return <h1>Nadešel konec zkušební doby programu</h1>

    const openComponent = (componentName: string) => {
        setActiveComponent(componentName);
        //updateCurrencyRate("CZK", "EUR", DEFAULT_COMPANY_HOURLY_RATE);
    }

    const closeComponent = () => {
        setActiveComponent(null);
    }

    const isThisActiveComponent = (componentName: string) => {
        return activeComponent === componentName;
    }

    async function updateCurrencyRate(to: string, from: string, amount: number) {
        const myHeaders = new Headers();
        myHeaders.append("apikey", "UQI6BUAy7xW6c8CskVVvPx1LCMik3Soq");

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const res = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`, requestOptions);
            console.log(res);
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
        } catch (err) {
            console.error('Error fetching exchange rates:', err);
        }
    }

    return (
        <div className="main-menu">
            <button className="employee-create-btn" onClick={() => isThisActiveComponent(createEmployee) ? closeComponent() : openComponent(createEmployee)}>{isThisActiveComponent(createEmployee) ? "zavřít" : "Vytvořit zaměstnance"}</button>
            <button className="employee-list-btn" onClick={() => isThisActiveComponent(listEmployees) ? closeComponent() : openComponent(listEmployees)}>{isThisActiveComponent(listEmployees) ? "zavřít" : "Zobrazit zaměstnance"}</button>
            <button className="order-create-btn" onClick={() => isThisActiveComponent(createOrder) ? closeComponent() : openComponent(createOrder)}>{isThisActiveComponent(createOrder) ? "zavřít" : "Vytvořit objednávku"}</button>
            <button className="employee-list-btn" onClick={() => isThisActiveComponent(listOrder) ? closeComponent() : openComponent(listOrder)}>{isThisActiveComponent(listOrder) ? "zavřít" : "Zobrazit objednávky"}</button>
            <button className="product-create-btn" onClick={() => isThisActiveComponent(createProduct) ? closeComponent() : openComponent(createProduct)}>{isThisActiveComponent(createProduct) ? "zavřít" : "Vytvořit produkt"}</button>
            <button className="product-list-btn" onClick={() => isThisActiveComponent(listProduct) ? closeComponent() : openComponent(listProduct)}>{isThisActiveComponent(listProduct) ? "zavřít" : "Zobrazit produkty"}</button>
            {isThisActiveComponent(createEmployee) ? <EmployeeCreateForm/> : null}
            {isThisActiveComponent(listEmployees) ? <EmployeeList/> : null}
            {isThisActiveComponent(createOrder) ? <OrderCreateForm/> : null}
            {isThisActiveComponent(listOrder) ? <OrderList/> : null}
            {isThisActiveComponent(createProduct) ? <ProductCreateForm/> : null}
            {isThisActiveComponent(listProduct) ? <ProductList/> : null}
        </div>
    )
}

export default App;