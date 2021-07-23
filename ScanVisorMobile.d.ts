import React from 'react';
import './assets/common.css';
import './assets/scan_visor_mobile.css';
declare type Props = {
    descriptionPanel: JSX.Element;
    centerPanel: JSX.Element;
    energyValue: string;
};
export default class ScanVisorMobile extends React.Component<Props> {
    svgRef: React.RefObject<SVGElement>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    centerDivRef: React.RefObject<HTMLDivElement>;
    descriptionDivRef: React.RefObject<HTMLDivElement>;
    energyTextRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props);
    resizeListener: () => void;
    render(): JSX.Element;
    rescale(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export {};
