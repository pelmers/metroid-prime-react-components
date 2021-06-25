import React from 'react';
import ReactDOM from 'react-dom';
import { VisorSelect } from '..';

import './demo.css';

const body = document.querySelector('body');

const consoleLog = () => {
    console.log('clicked');
};
class App extends React.Component<{}> {
    topRef: React.RefObject<HTMLDivElement>;
    constructor(props: {}) {
        super(props);
        this.topRef = React.createRef();
    }
    render() {
        return (
            <VisorSelect
                className="visor_select"
                top={{
                    text: 'this',
                    onClick: consoleLog,
                    href: 'https://pelmers.com/',
                }}
                left={{ text: 'what', onClick: consoleLog }}
                right={{ text: 'is??', onClick: consoleLog }}
                radar={{ src: './favicon.ico', onClick: consoleLog }}
                map={{ src: './favicon.ico', onClick: consoleLog }}
            />
        );
    }
}

ReactDOM.render(<App />, body);
