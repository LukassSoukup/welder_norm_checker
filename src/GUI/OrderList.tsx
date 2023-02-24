import React, {useEffect, useState} from 'react';
import "./css/orderList.css";

export const OrderList = () => {
    const [orderList, setOrderList] = useState<IlistResponse>({});

    useEffect(() => {
        window.Order.list().then((data) => {
            console.log(data);
            setOrderList(data);
        });
    }, []);


    return (
        <div>
            <ul className="order-list">
                {Object.keys(orderList).length > 0 && orderList.map((order: IOrder) => (
                    <li key={order.orderNumber} className="order-item">
                        <h2 className="order-number">Zakázka číslo: {order.orderNumber}</h2>
                        <p className="due-date">Datum dodání: {order.dueDate}</p>
                        <p className="product-list-header">Produkty: </p>
                        <ul className="product-list">
                            {order.listOfProducts.map((product: IProduct) => (
                                <li key={product.articleNum} className="product-item">
                                    <p className="article-num">Artikel-Nr.: {product.articleNum}</p>
                                    <p className="price-per-product">Cena za kus: {product.price},- Kč</p>
                                    <p className="product-amount">Počet: {product.amount}</p>
                                    <p className="time-to-complete">Čas na zpracování: {product.timeToComplete}</p>
                                    {product.detail && <p className="detail">Popisek: {product.detail}</p>}
                                </li>
                            ))}
                        </ul>
                        <p className={`order-state ${order.state ? "completed" : "pending"}`}>
                            {order.state ? "Splněno" : "Probíhá"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
