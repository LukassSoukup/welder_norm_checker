import React, {useState} from 'react';

export const EmployeeCreateForm = () => {
    const [employeeName, setEmployeeName] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.Employee.create({name: employeeName});
        eraseValues();
    };

    const eraseValues = () => {
        setEmployeeName('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Jméno nového zaměstnance:
                <input type="text" value={employeeName} onChange={event => setEmployeeName(event.target.value)}/>
            </label>
            <br/>
            <button type="submit" disabled={!employeeName}>Přidat nového zaměstnance</button>
        </form>
    );
};
