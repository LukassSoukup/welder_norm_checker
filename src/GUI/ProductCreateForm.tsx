import React, { useState } from 'react';
import "./css/general.css";
import "./css/productCreateForm.css";
type ProductCreateFormProps = {
    addProductToOrder?: (product: IProduct) => void;
};

const defaultPrice = 0;
const defaultAmount = 0;
const defaultTimeToComplete = "01:00";

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

    const handleSubmit = (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        event.preventDefault();
        if(typeof addProductToOrder === "function") addProductToOrder({articleNum, timeToComplete, price, amount, detail});
        else window.Product.create({articleNum, timeToComplete, price, amount, detail});
        eraseValues()
    };

    return (
        <form className="create-product-form" onSubmit={handleSubmit}>
            <label className="article-num">
                Artikel-Nr.:
                <input className="article-num-input" type="text" value={articleNum} onChange={event => setArticleNum(event.target.value)} required/>
            </label>
            <br />
            <label className="price">
                Cena za kus:
                <input className="price-input" min="0" placeholder="Kč" type="number" value={price ? price : ''} onChange={event => setPrice(Number(event.target.value))} required/>
            </label>
            <br />
            <label className="amount">
                Počet:
                <br />
                <input className="amount-input" placeholder="počet" min="0" type="number" value={amount ? amount : ''} onChange={event => setAmount(Number(event.target.value))}/>
            </label>
            <br />
            <label className="time-to-complete">
                Čas na zpracování:
                <input className="time-to-complete-input" type="time" value={timeToComplete} onChange={event => setTimeToComplete(event.target.value)} required/>
            </label>
            <br />
            <label className="description">
                Poznámka:
                <input className="description-input" type="text" value={detail} onChange={event => setDetail(event.target.value)} />
            </label>
            <button className="send-btn" type="submit">Přidat</button>
        </form>
    )
}