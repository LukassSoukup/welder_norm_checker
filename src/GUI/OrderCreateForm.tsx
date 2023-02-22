import React, {useState} from 'react';
import {ProductCreateForm} from "./ProductCreateForm";


export const OrderCreateForm = async() => {
    const [orderNumber, setOrderNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [listOfProducts, setListOfProducts] = useState<IProduct[]>([]);
    const [showAddProductForm, setShowAddProductForm] = useState(false);


    console.log(await window.Order.list());
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("creating order...");
        window.Order.create({orderNumber, dueDate, listOfProducts})
        console.log("request submitted");
    };

    const handleAddProduct = (product: IProduct) => {
        setListOfProducts([
            ...listOfProducts,
            product
        ]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Order Number:
                <input type="text" value={orderNumber} onChange={event => setOrderNumber(event.target.value)}/>
            </label>
            <br/>
            <label>
                Due Date:
                <input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)}/>
            </label>
            <br/>
            <label>
                {!showAddProductForm ? "Přidat produkt" : "Zavřít"}
                <input type="checkbox" onChange={() => setShowAddProductForm((prev) => !prev)}/>
            </label>
            {showAddProductForm ? <ProductCreateForm onSubmit={handleAddProduct}/> : null}
            <br/>
            <button type="submit">Submit</button>
        </form>
    );
};
