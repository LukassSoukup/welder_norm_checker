import React, {useEffect, useState} from 'react';
import "./css/orderList.css";

export const ProductList = () => {
    const [productList, setProductList] = useState<IlistResponse>([]);

    useEffect(() => {
        window.Product.list().then((data) => {
            console.log(data);
            setProductList(data);
        });
    }, []);

    return (
        <div>
            <ul className="product-list">
                    {productList.length > 0 && productList.map((product: IProduct) => (
                        <li key={product.articleNum} className="product-item">
                            <p className="article-num">Artikel-Nr.: {product.articleNum}</p>
                            <p className="price-per-product">Cena za kus: {product.price},- Kč</p>
                            <p className="product-amount">Počet: {product.amount} ks</p>
                            <p className="time-to-complete">Čas na zpracování: {product.timeToComplete}</p>
                            {product.detail && <p className="detail">Popisek: {product.detail}</p>}
                        </li>
                    ))}
            </ul>
        </div>
    );
};
