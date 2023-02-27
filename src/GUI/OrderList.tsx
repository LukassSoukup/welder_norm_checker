import React, {useEffect, useState} from 'react';
import "./css/orderList.css";
import {OrderTile} from "./OrderTile";

export const OrderList = () => {
    const [orderList, setOrderList] = useState<IlistResponse>({});
    const [totalProductAmount, setTotalProductAmount] = useState<IlistResponse>({});

    useEffect(() => {
        window.Order.list().then((data) => {
            console.log(data);
            setOrderList(data);
            getTotalProductAmount(data);
        });
    }, []);

    const onOrderClose = (order: IOrder) => {
        order.state = true;
        window.Order.update(order);
        window.Order.list().then((data) => {
            setOrderList(data);
            getTotalProductAmount(data);
        });
    }

    const getTotalProductAmount = (_orderList: IlistResponse) => {
        const _totalProductAmount: IlistResponse = {}
        _orderList.forEach((order: IOrder) => {
            if (order.state) return;
            order.listOfProducts.forEach((product: IProduct) => {
                if (!_totalProductAmount[product.articleNum]) _totalProductAmount[product.articleNum] = product.amountByOrder;
                else _totalProductAmount[product.articleNum] += product.amountByOrder;
            });
        });
        setTotalProductAmount(_totalProductAmount);
    }

    return (
        <div>
            <ul className="order-list">
                <ul className="order-list">
                    {Object.keys(orderList).length > 0 && orderList.map((order: IOrder) => (
                        <OrderTile order={order} totalProductAmount={totalProductAmount} onOrderClose={onOrderClose}/>
                    ))}
                </ul>
            </ul>
        </div>
    );
};
