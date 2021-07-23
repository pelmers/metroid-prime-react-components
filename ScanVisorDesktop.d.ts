import React from 'react';
import './assets/common.css';
import './assets/scan_visor_desktop.css';
export declare type ScanVisorDesktopProps = {
    descriptionPanel: JSX.Element;
    centerPanel: JSX.Element;
    leftPanel: JSX.Element;
    rightPanel: JSX.Element;
    energyValue: string;
};
export default class ScanVisorDesktop extends React.Component<ScanVisorDesktopProps> {
    svgRef: React.RefObject<SVGElement>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    centerDivRef: React.RefObject<HTMLDivElement>;
    descriptionDivRef: React.RefObject<HTMLDivElement>;
    leftDivRef: React.RefObject<HTMLDivElement>;
    rightDivRef: React.RefObject<HTMLDivElement>;
    energyTextRef: React.RefObject<HTMLDivElement>;
    constructor(props: ScanVisorDesktopProps);
    resizeListener: () => void;
    render(): JSX.Element;
    rescale(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
