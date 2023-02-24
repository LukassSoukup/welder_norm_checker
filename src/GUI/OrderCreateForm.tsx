import React, {useState} from 'react';
import {ProductCreateForm} from "./ProductCreateForm";

type ProductInOrderType = Record<string, number>;

export const OrderCreateForm = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [listOfProducts, setListOfProducts] = useState<ProductInOrderType>({});
    const [showAddProductForm, setShowAddProductForm] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("creating order...");
        window.Order.create({orderNumber, dueDate, listOfProducts});
        eraseValues();
        console.log("request submitted");
    };

    const eraseValues = () => {
        setOrderNumber('');
        setDueDate('');
        setListOfProducts({});
        setShowAddProductForm(false);
    }

    const addProductToOrder = (articleNum: string, amount: number) => {
        setListOfProducts((prev) => {
            return {...prev, [articleNum]: amount }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Číslo zakázky:
                <input type="text" value={orderNumber} onChange={event => setOrderNumber(event.target.value)}/>
            </label>
            <br/>
            <label>
                Dodací lhůta
                <input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)}/>
            </label>
            <br/>
            <label>
                {!showAddProductForm ? "Přidat produkt" : "Zavřít"}
                <input type="checkbox" onChange={() => setShowAddProductForm((prev) => !prev)}/>
            </label>
            {showAddProductForm ? <ProductCreateForm addProductToOrder={addProductToOrder} /> : null}
            <br/>
            <button type="submit" disabled={Object.keys(listOfProducts).length === 0}>Založit objednávku</button>
        </form>
    );
};
