import React, {useState} from 'react';
import TextInputWithWhisperer from "./TextInputWithWhisperer";
import {toMillis} from "../helpers/timeFormatHelper";
import "./css/general.css";
import "./css/dailyLogCreateForm.css";

const defaultArrivedToWork = '07:00'
const defaultLeftWork = '17:00'
type amountDoneByProduct = { [articleNum: string]: number }
export const DailyLogCreateForm = ({
                                       employee,
                                       forceUpdateFn
                                   }: { employee: IEmployee, forceUpdateFn: () => void }) => {
    const [arrivedToWork, SetArrivedToWork] = useState(defaultArrivedToWork);
    const [leftWork, setLeftWork] = useState(defaultLeftWork);
    const [amountDone, setAmountDone] = useState<amountDoneByProduct>({});
    const [selectedProductList, setSelectedProductList] = useState<IProduct[]>([]);
    const [date, setDate] = useState(''); // if set, has to be ISO format

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const productsToSet: IlistResponse = {};
        const workTime = toMillis(leftWork) - toMillis(arrivedToWork);
        let productTime = 0
        event.preventDefault();
        selectedProductList.forEach((product: IProduct) => {
            productsToSet[product.articleNum] = amountDone[product.articleNum];
            productTime += toMillis(product.timeToComplete) * amountDone[product.articleNum];
        });
        if (date) window.DailyLog.add(employee, {
            workTime,
            productTime,
            productList: productsToSet
        }, new Date(date).toISOString());
        else window.DailyLog.add(employee, {
            workTime,
            productTime,
            productList: productsToSet
        });
        eraseValues();
        forceUpdateFn();
    };

    const eraseValues = () => {
        SetArrivedToWork(defaultArrivedToWork);
        setLeftWork(defaultLeftWork);
        setSelectedProductList([]);
        setDate('');
        setAmountDone({});
    }

    const validateArrivedToWork = (value: string) => {
        if (toMillis(leftWork) > toMillis(value)) {
            SetArrivedToWork(value);
        } else alert("Příchod musí být dřív než odchod!");
    }
    const validateLeftWork = (value: string) => {
        if (toMillis(arrivedToWork) > toMillis(value)) {
            setLeftWork(value);
        } else alert("Příchod musí být dřív než odchod!");
    }
    return (
        <form className="daily-log-create-form" onSubmit={handleSubmit}>
            <i className="log-for">Výkaz pro</i> <b>{employee.name}</b>
            <br/>
            <br/>
            <label className="arrived-to-work">
                Příchod:
                <input className="arrived-to-work-input" type="time" value={arrivedToWork}
                       onChange={event => validateArrivedToWork(event.target.value)}
                       required={true}/>
            </label>
            <br/>
            <label className="left-work">
                Odchod:
                <input className="left-work-input" type="time" value={leftWork}
                       onChange={event => validateLeftWork(event.target.value)}
                       required={true}/>
            </label>
            <br/>
            <div id={"product-inputs"}>
                <TextInputWithWhisperer setAmountDone={setAmountDone}
                                        setSelectedProductList={setSelectedProductList}
                                        employeeAssignedWork={employee.assignedWork}/>
                <ul className={selectedProductList.length > 0 ? "selected-product-list" : ''}>
                    {selectedProductList.length > 0 && selectedProductList.map(product => (
                        <li className="selected-product"
                            key={product.articleNum}>{product.articleNum} {amountDone[product.articleNum]} ks</li>
                    ))}
                </ul>
            </div>
            <br/>
            <label className="log-date">
                Zpětně vykázat:
                <input className="log-date-input" type="date" value={date}
                       onChange={event => setDate(event.target.value)}/>
            </label>
            <br/>
            <button disabled={Object.keys(amountDone).length === 0} className="send-btn" type="submit">Vykázat</button>
        </form>
    );
};
