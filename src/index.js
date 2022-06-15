import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RenderMainWeb } from './Render_Web'

function MyForm() {
    const [pricelist, setPriceList] = useState(null);
    const [cars, setCars] = useState(null)
    if (pricelist === null) {
        fetch('./data.json', { cache: "no-store" }).then(response =>
            response.json().then(data => ({
                data: data,
            })
            ).then(res => {
                if (res.data !== null) {
                    setPriceList(res.data.ceny);
                }
            }));
    }
    if (cars === null) {
        fetch('https://raw.githubusercontent.com/CSKalkulator/additionaldata/main/cars.json', { cache: "no-store" }).then(response =>
            response.json().then(data => ({
                data: data,
            })
            ).then(res => {
                if (res.data !== null) {
                    setCars(res.data);
                }
            }));
    }
        return (
            <RenderMainWeb pricelist={pricelist} cars={cars} />
        );
}


const formContainer = document.getElementById('form_placeholder');
const form = ReactDOM.createRoot(formContainer);
form.render(<MyForm />)

//table.render(<DrawTable data={this.state.data} />);




