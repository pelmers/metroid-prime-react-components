import React from 'react';
import ReactDOM from 'react-dom';
import { VisorSelect } from '..';

import './demo.css';

const body = document.querySelector('body');

class App extends React.Component<{}> {
    radarRef: React.RefObject<HTMLImageElement>;
    mapRef: React.RefObject<HTMLImageElement>;
    constructor(props: {}) {
        super(props);
        this.radarRef = React.createRef();
        this.mapRef = React.createRef();
    }
    render() {
        return (
            <VisorSelect
                top={{
                    text: 'Metroid Prime React Components',
                }}
                left={{
                    text: 'source code',
                    href: 'https://github.com/pelmers/metroid-prime-react-components',
                }}
                right={{
                    text: 'example site',
                    href: 'https://pelmers.com/',
                }}
                radar={{
                    component: (
                        <img
                            className="masked-image"
                            ref={this.radarRef}
                            src="favicon.ico"
                        ></img>
                    ),
                    getRef: () => this.radarRef,
                }}
                map={{
                    component: (
                        <img
                            className="masked-image"
                            ref={this.mapRef}
                            src="favicon.ico"
                        ></img>
                    ),
                    getRef: () => this.mapRef,
                }}
            />
        );
    }
}

ReactDOM.render(<App />, body);
