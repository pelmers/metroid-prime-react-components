import React from 'react';
import { ScanVisorDesktopProps } from './ScanVisorDesktop';
declare type State = {
    isMobile: boolean;
};
export default class ScanVisor extends React.Component<ScanVisorDesktopProps, State> {
    state: {
        isMobile: boolean;
    };
    resizeListener: () => void;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export {};
