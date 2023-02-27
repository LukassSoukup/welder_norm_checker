import React, { useState } from 'react';

type ProductCreateFormProps = {
    addProductToOrder: (product: IProduct) => void;
};

const defaultPrice = 1000;
const defaultAmount = 0;
const defaultTimeToComplete = "00:30";

export const ProductCreateForm = ({addProductToOrder}: ProductCreateFormProps) => {
    const [articleNum, setArticleNum] = useState('');
    const [amount, setAmount] = useState(defaultAmount);
    const [price, setPrice] = useState(defaultPrice);
    const [timeToComplete, setTimeToComplete] = useState(defaultTimeToComplete);
    const [detail, setDetail] = useState('');
    const eraseValues = () => {
        setArticleNum('');
        setAmount(defaultAmount);
        setPrice(defaultPrice);
        setTimeToComplete(defaultTimeToComplete);
        setDetail('');
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        addProductToOrder({articleNum, timeToComplete, price, amount, detail});
        eraseValues()
    };

    return (
        <div>
            <label>
                Artikel-Nr.:
                <input type="text" value={articleNum} onChange={event => setArticleNum(event.target.value)} required/>
            </label>
            <br />
            <label>
                Cena za kus:
                <input type="number" value={price} onChange={event => setPrice(Number(event.target.value))} required/>Kč
            </label>
            <br />
            <label>
                Počet:
                <input type="number" value={amount} onChange={event => setAmount(Number(event.target.value))} required/>
            </label>
            <br />
            <label>
                Čas na zpracování:
                <input type="time" value={timeToComplete} onChange={event => setTimeToComplete(event.target.value)} required/>
            </label>
            <br />
            <label>
                Poznámka:
                <input type="text" value={detail} onChange={event => setDetail(event.target.value)} />
            </label>
            <button onClick={(e) => handleSubmit(e)} type="submit">Přidat</button>
        </div>
    )
}