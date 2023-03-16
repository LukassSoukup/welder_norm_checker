import React, {KeyboardEvent, useEffect, useRef, useState} from 'react';
import './css/textInputWithWhisperer.css';
import {calculateRemainingProductAmountsForWorkAllocation} from "../helpers/calculationHelper";

type TextInputWithWhispererProps = {
    setAmountDone: React.Dispatch<React.SetStateAction<IProductAmountList>>;
    setSelectedProductList: React.Dispatch<React.SetStateAction<IProduct[]>>;
    forOrder?: boolean;
    allocatedWork?: IProductAmountList;
    employeeAssignedWork?: IProductAmountList;
};
type TextInputWithWhispererState = {
    inputValue: IProduct;
    showWhisperer: boolean;
    activeIndex: number;
};

function TextInputWithWhisperer({
                                    setAmountDone,
                                    setSelectedProductList,
                                    forOrder,
                                    allocatedWork, // for workAssignment
                                    employeeAssignedWork // for dailyLog
                                }: TextInputWithWhispererProps) {
    const initialState = {
        inputValue: {articleNum: '', price: 0, timeToComplete: ''},
        showWhisperer: false,
        activeIndex: -1,
    }
    const componentRef = useRef<HTMLDivElement>(null);
    const [productSelected, setProductSelected] = useState(false);
    const [state, setState] = useState<TextInputWithWhispererState>(initialState);
    const [productListAll, setProductListAll] = useState<IProduct[]>([]);
    const [localAmountDone, setLocalAmountDone] = useState<IProductAmountList>({});

    useEffect(() => {
        window.Product.list().then((data) => {
            setProductListAll(data);
        });
    }, [])

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

    let remainingProductAmount: IProductAmountList = {};
    let filteredProducts: IProduct[];
    // pro workAssignment - nemůžeš přiřadit víc práce než je celkově allokováno, pokud není nic alokováno, nemůžeš přidělit víc než je počtu produktů
    // pro dailyLog - zobraz jen ty produkty, které má zaměstnanec allokováno
    if (productListAll.length > 0) {
        if (forOrder) {
            filteredProducts = productListAll.filter((product) =>
                product.articleNum.toLowerCase().includes(state.inputValue.articleNum.toLowerCase()) && forOrder
            );
        } else if (allocatedWork) { // for workAssignment
            remainingProductAmount = calculateRemainingProductAmountsForWorkAllocation(productListAll, allocatedWork);
            filteredProducts = productListAll.filter((product) => product.articleNum.toLowerCase().includes(state.inputValue.articleNum.toLowerCase()) && remainingProductAmount[product.articleNum] > 0);
        }
        // pro dailyLog
        else if (employeeAssignedWork) {
            filteredProducts = productListAll.filter((product) =>
                product.articleNum.toLowerCase().includes(state.inputValue.articleNum.toLowerCase()) && employeeAssignedWork[product.articleNum] > 0
            );
        }
    } else return null;

    // Define the function to handle changes to the input value
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: IProduct = {articleNum: event.target.value, price: 0, timeToComplete: ''};
        if (!event.target.value) setState(prevState => ({...prevState, inputValue: value, showWhisperer: true}));
        else setState({inputValue: value, showWhisperer: value.articleNum.trim().length > 0, activeIndex: -1});
    };

    // Define the function to handle a whisperer suggestion being clicked
    const handleWhispererClick = (value: IProduct) => {
        setProductSelected(true);
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

    function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value || ''
        setLocalAmountDone((prev) => ({
            ...prev,
            [state.inputValue.articleNum]: Number(value)
        }))
    }

    function onConfirmBtnClick() {
        setSelectedProductList(prev => {
            if(prev.find(p => p.articleNum === state.inputValue.articleNum)) return [...prev];
            return [...prev, state.inputValue]
        });
        setAmountDone((prev) => ({
            ...prev,
            [state.inputValue.articleNum]: localAmountDone[state.inputValue.articleNum]
        }))
        setLocalAmountDone({});
        setState(initialState);
        setProductSelected(false);
    }

    function setInputMaxLimit() {
        if (forOrder) {
            return Infinity;
        } else if (employeeAssignedWork) {
            // pro dailyLog - neměl by být schopen vykázat víc množství než má allokováno
            if (localAmountDone[state.inputValue.articleNum] > employeeAssignedWork[state.inputValue.articleNum]) {
                setLocalAmountDone((prev) => ({
                    ...prev,
                    [state.inputValue.articleNum]: employeeAssignedWork[state.inputValue.articleNum]
                }))
            }
            return employeeAssignedWork[state.inputValue.articleNum]
        }
        // pro workAllocation neměl by mít možnost přidělit víc než než existuje
        if (localAmountDone[state.inputValue.articleNum] > remainingProductAmount[state.inputValue.articleNum]) {
            setLocalAmountDone((prev) => ({
                ...prev,
                [state.inputValue.articleNum]: remainingProductAmount[state.inputValue.articleNum]
            }))
        }
        return remainingProductAmount[state.inputValue.articleNum];
    }

    return (
        <div className="textInputWithWhisperer-section">
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
                    <input placeholder="Počet kusů" type="number"
                           max={setInputMaxLimit()} min={0}
                           value={localAmountDone[state.inputValue.articleNum] ? localAmountDone[state.inputValue.articleNum] : ''}
                           onChange={event => handleAmountChange(event)}/>
                    <button onClick={onConfirmBtnClick}>Potvrdit</button>
                </>
            }
        </div>
    );
}

export default TextInputWithWhisperer;
