import React, {useEffect, useState} from 'react';
import TextInputWithWhisperer from "./TextInputWithWhisperer";
import {toMillis} from "../shared_resources/timeFormatHelper";

const defaultArrivedToWork = '07:00'
const defaultLeftWork = '17:00'
type amountDoneByProduct = { [articleNum: string]: number }
export const DailyLogCreateForm = ({employee}: { employee: IEmployee }) => {
    const [arrivedToWork, SetArrivedToWork] = useState(defaultArrivedToWork);
    const [leftWork, setLeftWork] = useState(defaultLeftWork);
    const [amountDone, setAmountDone] = useState<amountDoneByProduct>({});
    const [productListAll, setProductListAll] = useState<IProduct[]>([]);
    const [selectedProductList, setSelectedProductList] = useState<IProduct[]>([]);
    const [date, setDate] = useState(''); // if set, has to be ISO format

    useEffect(() => {
        window.Product.list().then((data) => {
            console.log(data);
            setProductListAll(data);
        });
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const productsToSet: IlistResponse = {};
        let moneyEarned = 0;
        const workTime = toMillis(leftWork) - toMillis(arrivedToWork) - 30 * 60 * 1000;
        let productTime = 0
        event.preventDefault();
        selectedProductList.forEach((product: IProduct) => {
            productsToSet[product.articleNum] = amountDone[product.articleNum];
            moneyEarned += product.price * amountDone[product.articleNum];
            productTime += toMillis(product.timeToComplete);
            if (product.amount < 0) window.Product.reportError(product.articleNum);
            else window.Product.update(product);
        });
        const normAccomplished = workTime <= productTime;
        if (date) window.DailyLog.add(employee.id, moneyEarned, {
            arrivedToWork,
            leftWork,
            normAccomplished,
            productList: productsToSet
        }, new Date(date).toISOString());
        else window.DailyLog.add(employee.id, moneyEarned, {
            arrivedToWork,
            leftWork,
            normAccomplished,
            productList: productsToSet
        });
        eraseValues();
    };

    const eraseValues = () => {
        SetArrivedToWork(defaultArrivedToWork);
        setLeftWork(defaultLeftWork);
        setSelectedProductList([]);
        setDate('');
        setProductListAll([]);
    }
    return (
        <form onSubmit={handleSubmit}>
            <i>Výkaz pro: </i>
            <h2>{employee.name}</h2>
            <label>
                Zpětně vykázat:
                <input type="date" value={date} onChange={event => setDate(event.target.value)}/>
            </label>
            <br/>
            <label>
                Příchod:
                <input type="time" value={arrivedToWork} onChange={event => SetArrivedToWork(event.target.value)}
                       required={true}/>
            </label>
            <br/>
            <label>
                Odchod:
                <input type="time" value={leftWork} onChange={event => setLeftWork(event.target.value)}
                       required={true}/>
            </label>
            <br/>
            <div id={"product-inputs"}>
                <TextInputWithWhisperer amountDone={amountDone} setAmountDone={setAmountDone}
                                        productListAll={productListAll}
                                        setSelectedProductList={setSelectedProductList}/>
            </div>
            <br/>
            <button type="submit">Vykázat</button>
        </form>
    );
};
