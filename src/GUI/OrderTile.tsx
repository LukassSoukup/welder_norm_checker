import React, {useEffect, useState} from 'react';
import "./css/orderList.css";

export const OrderTile = ({order, totalProductAmount, onOrderClose}: { order: IOrder, totalProductAmount: IlistResponse, onOrderClose: (order: IOrder) => void }) => {
    const [canBeClosed, setCanBeClosed] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    useEffect(() => {
        canBeClosedFn();
        setIsClosed(order.state);
    },[]);
    const canBeClosedFn = () => {
        let isFinishedOrder = true;
        order.listOfProducts.forEach((product: IProduct) => {
            isFinishedOrder = product.amountByOrder <= totalProductAmount[product.articleNum] - product.amount;
        })
        if (isFinishedOrder) setCanBeClosed(true);
    }

    const closeOrder = () => {
        setIsClosed(true);
        setCanBeClosed(false);
        onOrderClose(order);
    }

    const displayProductAmounts = (product: IProduct) => {
        return (canBeClosed || isClosed) ? product.amountByOrder : totalProductAmount[product.articleNum] - product.amount;
    }

    return (
        <li key={order.orderNumber} className="order-item">
            <h2 className="order-number">Zakázka číslo: {order.orderNumber}</h2>
            <p className="due-date">Datum dodání: {order.dueDate}</p>
            <p className="product-list-header">Produkty: </p>
            <ul className="product-list">
                {order.listOfProducts.map((product: IProduct) => (
                    <li key={product.articleNum} className="product-item">
                        <p className="article-num">Artikel-Nr.: {product.articleNum}</p>
                        <p className="price-per-product">Cena za kus: {product.price},- Kč</p>
                        <p className="product-amount">Počet: {displayProductAmounts(product)}/{product.amountByOrder} ks <i>zpracováno/požadováno</i>
                        </p>
                        <p className="time-to-complete">Čas na zpracování: {product.timeToComplete}</p>
                        {product.detail && <p className="detail">Popisek: {product.detail}</p>}
                    </li>
                ))}
            </ul>
            <p className={`order-state ${(canBeClosed || isClosed) ? canBeClosed ? "completed-open" : "completed" : "pending"}`}>
                {(canBeClosed || isClosed) ? canBeClosed? "Splněno - Neuzavřeno" : "Splněno" : "Probíhá"}
            </p>
            {canBeClosed && (
                <button onClick={closeOrder}>Uzavřít objednávku</button>
            )}
        </li>
    );
};
