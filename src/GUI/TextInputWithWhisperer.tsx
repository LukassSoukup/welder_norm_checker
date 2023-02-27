import React, {KeyboardEvent, useEffect, useRef, useState} from 'react';
import './css/textInputWithWhisperer.css';

// Define the types for the component's props and state
type amountDoneByProduct = { [articleNum: string]: number }

type TextInputWithWhispererProps = {
    setAmountDone: React.Dispatch<React.SetStateAction<amountDoneByProduct>>;
    amountDone: amountDoneByProduct;
    productListAll: IProduct[];
    setSelectedProductList: React.Dispatch<React.SetStateAction<IProduct[]>>;
};
type TextInputWithWhispererState = {
    inputValue: IProduct;
    showWhisperer: boolean;
    activeIndex: number;
};

function TextInputWithWhisperer({
                                    amountDone,
                                    setAmountDone,
                                    productListAll,
                                    setSelectedProductList
                                }: TextInputWithWhispererProps) {
    // Define the component's state
    const initialState = {
        inputValue: {articleNum: '', price: 0, timeToComplete: ''},
        showWhisperer: false,
        activeIndex: -1,
    }
    const componentRef = useRef<HTMLDivElement>(null);
    const [productSelected, setProductSelected] = useState(false);
    const [state, setState] = useState<TextInputWithWhispererState>(initialState);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setState((prevState) => ({...prevState, showWhisperer: false}));
            } else setState((prevState) => ({...prevState, showWhisperer: true}));
        };

        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [componentRef]);

    // Define the function to handle changes to the input value
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: IProduct = {articleNum: event.target.value, price: 0, timeToComplete: ''};
        if (!event.target.value) setState(prevState => ({...prevState, inputValue: value, showWhisperer: true}));
        else setState({inputValue: value, showWhisperer: value.articleNum.trim().length > 0, activeIndex: -1});
    };

    // Define the function to handle a whisperer suggestion being clicked
    const handleWhispererClick = (value: IProduct) => {
        setProductSelected(true);
        setSelectedProductList(prev => [...prev, value]);
        setState({inputValue: value, showWhisperer: false, activeIndex: -1});
    };
    // Define the function to handle keydown events on the input

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setState((prevState) => ({
                ...prevState,
                activeIndex: Math.min(prevState.activeIndex + 1, filteredProducts.length - 1),
            }));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setState((prevState) => ({...prevState, activeIndex: Math.max(prevState.activeIndex - 1, -1)}));
        } else if (event.key === 'Enter') {
            if (state.activeIndex !== -1) {
                handleWhispererClick(filteredProducts[state.activeIndex]);
            }
        }
    };
    // Filter the products array based on the input value

    const filteredProducts = productListAll.filter((product) =>
        product.articleNum.toLowerCase().includes(state.inputValue.articleNum.toLowerCase()) && product.amount > 0 && !amountDone[product.articleNum]
    );

    function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value || ''
        setAmountDone((prev) => ({
            ...prev,
            [state.inputValue.articleNum]: Number(value)
        }))
    }

    function onConfirmBtnClick() {
        setState(initialState);
        setProductSelected(false);
    }

    return (
        <>
            <div className="textInputWithWhisperer" ref={componentRef}>
                <div className="arrow"></div>
                <input
                    placeholder="Výrobek..."
                    type="text"
                    value={state.inputValue.articleNum}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                />
                {state.showWhisperer && (
                    <ul className="whispererList">
                        {filteredProducts.map((product, index) => (
                            <li
                                key={product.articleNum}
                                onClick={() => handleWhispererClick(product)}
                                className={index === state.activeIndex ? 'active' : ''}
                            >
                                {product.articleNum}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {productSelected &&
                <>
                <input placeholder="Počet zpracovaných kusů" type="number" max={state.inputValue.amount} min={0}
                       value={amountDone[state.inputValue.articleNum]}
                       onChange={event => handleAmountChange(event)}/>
                <button onClick={onConfirmBtnClick}>Potvrdit</button>
                </>
            }
        </>
    );
}

export default TextInputWithWhisperer;