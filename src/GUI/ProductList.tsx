import React, {useEffect, useState} from 'react';
import "./css/general.css";
import "./css/productList.css";
import Icon from '@mdi/react';
import {mdiCheck, mdiPencil, mdiPlusCircle, mdiWindowClose} from '@mdi/js';

const initialProduct = {
    articleNum: '',
    price: 0,
    timeToComplete: '',
    amount: 0,
    detail: ''
};
export const ProductList = () => {
    const [productList, setProductList] = useState<IlistResponse>([]);
    const [updateProduct, setUpdateProduct] = useState<IProduct>(initialProduct);
    const [showAddAmount, setShowAddAmount] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        window.Product.list().then((data) => {
            setProductList(data);
        });
    }
    const forceUpdateFn = (isUpdate?: boolean) => {
        if(isUpdate) setTimeout(() => loadProducts(), 200);
        setShowAddAmount('');
        setUpdateProduct(initialProduct);
    }
    const openMenu = (product: IProduct) => {
        if (updateProduct.articleNum === product.articleNum) setUpdateProduct(initialProduct);
        else setUpdateProduct(product);
    }

    const openAddAmountInput = (id: string) => {
        if (showAddAmount === id) setShowAddAmount('');
        else setShowAddAmount(id);
    }

    return (
        <ul className="product-list">
            {productList.length > 0 && productList.map((product: IProduct) => {
                if (updateProduct.articleNum === product.articleNum) {
                    return <ProductUpdate product={product} closeEdit={forceUpdateFn}/>;
                } else {
                    return (
                        <li key={product.articleNum} className="product-item">
                            <button className="update-product-btn" onClick={() => openMenu(product)}><Icon
                                path={mdiPencil} size={1}/></button>
                            <p className="article-num">Artikel-Nr.: {product.articleNum}</p>
                            <p className="price-per-product">Cena za kus: {product.price},- Kč</p>
                            <div className="amount-section">
                                <p className="product-amount">Počet: {product.amount} ks</p>
                                <button className="add-product-amount-btn"
                                        onClick={() => openAddAmountInput(product.articleNum)}><Icon
                                    path={showAddAmount === product.articleNum ? '' : mdiPlusCircle}
                                    size={1}/></button>
                                {showAddAmount === product.articleNum &&
                                    <ProductAddAmount articleNum={product.articleNum} closeEdit={forceUpdateFn}/>}
                            </div>
                            <p className="time-to-complete">Čas na zpracování: {product.timeToComplete}</p>
                            {product.detail && <p className="detail">Popisek: {product.detail}</p>}
                        </li>
                    );
                }
            })}
        </ul>
    );
};

export const ProductAddAmount = ({
                                     articleNum,
                                     closeEdit
                                 }: { articleNum: string, closeEdit: (isUpdate? :boolean) => void }) => {
    const [amount, setAmount] = useState(0);
    const closeThisWindow = () => {
        closeEdit();
    }
    const saveChanges = () => {
        window.Product.addAmount(articleNum, amount);
        closeEdit(true);
    }

    return (
        <div className="add-product-amount-section">
            <input className="amount-input" min="0" type="number" placeholder="Přidat počet"
                   value={amount ? amount : ''}
                   onChange={event => setAmount(Number(event.target.value))}/>
            <button disabled={amount <= 0} className="confirm-update-btn" onClick={() => saveChanges()}><Icon
                path={mdiCheck} size={1}/></button>
            <button className="cancel-update-btn" onClick={() => closeThisWindow()}><Icon path={mdiWindowClose}
                                                                                          size={1}/></button>
        </div>
    )
}

export const ProductUpdate = ({
                                  product,
                                  closeEdit
                              }: { product: IProduct, closeEdit: (isUpdate? :boolean) => void }) => {
    const [stateProduct, setStateProduct] = useState<IProduct>(product);
    const closeThisWindow = () => {
        closeEdit();
    }
    const saveChanges = () => {
        window.Product.update(stateProduct);
        closeEdit(true);
    }

    const updateProductState = (key: string, val: string | number) => {
        setStateProduct((prev) => ({...prev, [key]: val}));
    }
    return (
        <li className="product-update-section">
            <p className="article-num">Artikel-Nr.: {product.articleNum}</p>
            <label className="price">
                Cena za kus:
                <input className="price-input" min="0" placeholder="Kč" type="number"
                       value={stateProduct.price ? stateProduct.price : ''}
                       onChange={event => updateProductState("price", Number(event.target.value))}/>
            </label>
            <br/>
            {/* TODO implement in productController/update
            <label className="amount">
                Počet:
                <input className="amount-input" min="0" type="number" value={stateProduct.amount ? stateProduct.amount : ''} onChange={event => updateProductState("amount", Number(event.target.value))}/>
            </label>
            <br/>
            <label className="time-to-complete">
                Čas na zpracování:
            <input className="time-to-complete-input" type="time" value={stateProduct.timeToComplete} onChange={event => updateProductState("timeToComplete", event.target.value)}/>
            </label>
            <br />
            */}
            <label className="description">
                Poznámka:
                <input className="description-input" type="text" value={stateProduct.detail}
                       onChange={event => updateProductState("detail", event.target.value)}/>
            </label>
            <div className="confirm-section">
                <button className="confirm-update-btn" onClick={() => saveChanges()}><Icon path={mdiCheck} size={1}/>
                </button>
                <button className="cancel-update-btn" onClick={() => closeThisWindow()}><Icon path={mdiWindowClose}
                                                                                              size={1}/></button>
            </div>
        </li>
    )
}
