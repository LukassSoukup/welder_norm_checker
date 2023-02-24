import React, { useState } from 'react';

type ProductCreateFormProps = {
    addProductToOrder: (articleNum: string, amount: number) => void;
};

export const ProductCreateForm = ({addProductToOrder}: ProductCreateFormProps) => {
    const [articleNum, setArticleNum] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [timeToComplete, setTimeToComplete] = useState("00:30");
    const [detail, setDetail] = useState('');
    const eraseValues = () => {
        setArticleNum('');
        setAmount(0);
        setPrice(100);
        setTimeToComplete("00:30");
        setDetail('');
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        window.Product.create({articleNum, timeToComplete, detail})
        addProductToOrder(articleNum, amount);
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