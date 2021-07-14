import React from 'react';
import ReactDOM from 'react-dom';
import { VisorSelect } from '..';
import ScanVisorDesktop from '../ScanVisorDesktop';

import './demo.css';

const $body = document.querySelector('body');

type State = {
    visor: 'select' | 'scan';
};

const consoleLog = () => {
    console.log('clicked');
};
class App extends React.Component<{}, State> {
    state: State = { visor: 'scan' };

    radarRef: React.RefObject<HTMLImageElement>;
    mapRef: React.RefObject<HTMLImageElement>;
    constructor(props: {}) {
        super(props);
        this.radarRef = React.createRef();
        this.mapRef = React.createRef();
    }
    render() {
        if (this.state.visor === 'select') {
            return (
                <VisorSelect
                    top={{
                        text: 'my page',
                        href: 'https://pelmers.com/',
                    }}
                    left={{
                        text: 'scan visor',
                        onClick: () => this.setState({ visor: 'scan' as const }),
                    }}
                    right={{ text: 'is??', onClick: consoleLog }}
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
        } else if (this.state.visor === 'scan') {
            return (
                <ScanVisorDesktop
                    centerPanel={
                        <div>
                            <div
                                onClick={() => this.setState({ visor: 'select' })}
                                style={{ cursor: 'pointer' }}
                            >
                                back to select
                            </div>
                        </div>
                    }
                    rightPanel={<div>right text</div>}
                    leftPanel={<div>left text</div>}
                    descriptionPanel={
                        <div className="scan-description-content">
                            description title
                            <div style={{ paddingTop: '1em', fontSize: '22px' }}>
                                this would be a sentence about the content.
                            </div>
                            <button>action button</button>
                        </div>
                    }
                    energyValue="99"
                />
            );
        }
    }
}

ReactDOM.render(<App />, $body);
