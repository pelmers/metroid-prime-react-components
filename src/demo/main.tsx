import React from 'react';
import ReactDOM from 'react-dom';
import { VisorSelect } from '..';

import './demo.css';

const body = document.querySelector('body');

function App() {
    const consoleLog = () => {
        console.log('clicked');
    };
    return (
        <VisorSelect
            className="visor_select"
            left={{ text: 'what', onClick: consoleLog }}
            right={{ text: 'is??', onClick: consoleLog }}
            top={{ text: 'this', onClick: consoleLog }}
            radar={{ src: './favicon.ico', onClick: consoleLog }}
            map={{ src: './favicon.ico', onClick: consoleLog }}
        />
    );
}

ReactDOM.render(<App />, body);
