import React, { useState } from 'react';

interface ProductFormProps {
    onSubmit: ({ articleNum, amount, timeToComplete, detail }: { articleNum: string, amount: number, timeToComplete: string, detail: string }) => void;
}

export const ProductCreateForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
    const [articleNum, setArticleNum] = useState('');
    const [amount, setAmount] = useState(0);
    const [timeToComplete, setTimeToComplete] = useState('');
    const [detail, setDetail] = useState('');
    const eraseValues = () => {
        setArticleNum('');
        setAmount(0);
        setTimeToComplete('');
        setDetail('');
    }
    const handleSubmit = () => {
        onSubmit({articleNum, amount, timeToComplete, detail});
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
            <button onClick={() => handleSubmit()} type="submit">Přidat</button>
        </div>
    )
}