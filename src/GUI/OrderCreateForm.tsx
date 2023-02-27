import React, {useState} from 'react';
import {ProductCreateForm} from "./ProductCreateForm";

const defaultDueDate = new Date(Date.now() + 12096e5).toISOString().split('T')[0] // now + 14 days yyyy-mm-dd
export const OrderCreateForm = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [dueDate, setDueDate] = useState(defaultDueDate);
    const [listOfProducts, setListOfProducts] = useState<IProduct[]>([]);
    const [showAddProductForm, setShowAddProductForm] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const productsToSet: IlistResponse = {};
        listOfProducts.forEach((product: IProduct) => {
            productsToSet[product.articleNum] = product.amount;
            window.Product.create(product, true);
        });
        window.Order.create({orderNumber, dueDate, listOfProducts: productsToSet, state: false});
        eraseValues();
    };

    const eraseValues = () => {
        setOrderNumber('');
        setDueDate(defaultDueDate);
        setListOfProducts([]);
        setShowAddProductForm(false);
    }

    const addProductToOrder = (product: IProduct) => {
        setListOfProducts((prev) => [...prev, product ]);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Číslo zakázky:
                <input type="text" value={orderNumber} onChange={event => setOrderNumber(event.target.value)}/>
            </label>
            <br/>
            <label>
                Dodací lhůta:
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
