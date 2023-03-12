import React, {useState} from 'react';
import "./css/employeeCreateForm.css";
import "./css/general.css";

export const EmployeeCreateForm = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [hourlyRate, setHourlyRate] = useState(0);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.Employee.create({name: employeeName, hourlyRate: hourlyRate, assignedWorkTime: 0, assignedWork: {}});
        eraseValues();
    };

    const eraseValues = () => {
        setEmployeeName('');
        setHourlyRate(0);
    }

    return (
        <form className="employee-create-form" onSubmit={handleSubmit}>
            <label className="employee-name">
                Jméno nového zaměstnance:
                <input className="employee-name-input" type="text" value={employeeName} onChange={event => setEmployeeName(event.target.value)} required={true}/>
            </label>
            <br/>
            <label className="hourly-rate">
                výdělek za hodinu práce:
                <input className="hourly-rate-input" min="0" type="number" value={hourlyRate? hourlyRate : ''} onChange={event => setHourlyRate(Number(event.target.value))} required={true}/>
            </label>
            <br/>
            <button className="send-btn" type="submit" disabled={!employeeName}>Přidat nového zaměstnance</button>
        </form>
    );
};
