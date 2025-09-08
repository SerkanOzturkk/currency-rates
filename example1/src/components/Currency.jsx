import React, { useState } from 'react'
import '../css/Currency.css';
import { FaExchangeAlt } from "react-icons/fa";
import axios from 'axios'
import currencyList from '../currency_list.json';

const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';
const API_KEY = import.meta.env.VITE_API_KEY;


const translations = {
    EN: {
        title: "Currency Converter",
        convertButton: "Convert",
    },
    TR: {
        title: "Para Birimi Dönüştürücü",
        convertButton: "Çevir",
    }
};

export default function Currency() {

    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('TRY');
    const [result, setResult] = useState('');
    const [language, setLanguage] = useState('EN')

    const currentText = translations[language];

    const exchange = async () => {

        if (!API_KEY) {
            console.error('API Key not found! Please check your .env file.');
            setResult('API Key error!');
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurrency}`);
            console.log('API Response:', response.data);
            const result = ((response.data.data[toCurrency]) * (amount)).toFixed(2);
            setResult(result);
        } catch (error) {
            console.error('API Error:', error);
            setResult('Connection error!');
        }
    }

    const validateAmount = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setAmount(value);
        }
    }

    const changeCurrency = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    return (
        <div>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)} className='language-selector'

            >
                <option value="EN">English</option>
                <option value="TR">Türkçe</option>
            </select>

            <div className='currency-div'>
                <div style={{ fontFamily: 'arial', backgroundColor: 'black', color: '#fff', width: '100%', textAlign: 'center' }}>
                    <h3>{currentText.title}</h3>
                </div>
                <div style={{ marginTop: '25px' }}>
                    <input
                        type="number"
                        className='amount'
                        value={amount}
                        onChange={validateAmount} />
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)} className='from-currency-option'>
                        {Object.keys(currencyList).map(code => (
                            <option key={code} value={code}> {code}</option>
                        ))}
                    </select>

                    <FaExchangeAlt
                        onClick={changeCurrency}
                        className='right-arrow' />

                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)} className='to-currency-option'>
                        {Object.keys(currencyList).map(code => (
                            <option key={code} value={code}> {code}</option>
                        ))}
                    </select>

                    <input
                        value={result}
                        type="number"
                        className='result'
                        readOnly />
                </div>
                <div>
                    <button
                        onClick={exchange}
                        className='exchange-button'>{currentText.convertButton}</button>
                </div>
            </div>
        </div>
    )
}
