import React, {useState} from 'react';
import TextInputWithWhisperer from "./TextInputWithWhisperer";
import "./css/orderCreateForm.css";
import "./css/general.css";

type amountDoneByProduct = { [articleNum: string]: number }
const defaultDueDate = new Date(Date.now() + 12096e5).toISOString().split('T')[0] // now + 14 days yyyy-mm-dd
export const OrderCreateForm = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [dueDate, setDueDate] = useState(defaultDueDate);
    const [amountDone, setAmountDone] = useState<amountDoneByProduct>({});
    const [selectedProductList, setSelectedProductList] = useState<IProduct[]>([]);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const orderExists = await window.Order.exists(orderNumber);
        if (orderExists) return alert(`Objednávka číslo ${orderNumber} již existuje! Nelze ji vytvořit znovu.`);
        event.preventDefault();
        const productsToSet: IlistResponse = {};
        console.log(amountDone);
        selectedProductList.forEach((product: IProduct) => {
            productsToSet[product.articleNum] = amountDone[product.articleNum];
            product.amount += amountDone[product.articleNum];
            console.log(product);
            window.Product.update(product);
        });
        window.Order.create({orderNumber, dueDate, listOfProducts: productsToSet, state: false});
        eraseValues();
    };

    const eraseValues = () => {
        setOrderNumber('');
        setDueDate(defaultDueDate);
        setSelectedProductList([]);
        setAmountDone({});
    }

    return (
        <form className="order-create-form" onSubmit={handleSubmit}>
            <label className="order-number">
                Číslo zakázky:
                <input className="order-number-input" type="text" value={orderNumber} onChange={event => setOrderNumber(event.target.value)}/>
            </label>
            <br/>
            <label className="due-date">
                Dodací lhůta:
                <input className="due-date-input" type="date" value={dueDate} onChange={event => setDueDate(event.target.value)}/>
            </label>
            <br/>
            <div className={"product-inputs"}>
                <TextInputWithWhisperer amountDone={amountDone} setAmountDone={setAmountDone}
                                        setSelectedProductList={setSelectedProductList} forOrder={true}/>
            </div>
            <br/>
            <button className="send-btn" type="submit" disabled={Object.keys(selectedProductList).length === 0}>Založit objednávku</button>
        </form>
    );
};
