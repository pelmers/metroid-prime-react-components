import React from 'react';
import './assets/common.css';
import './assets/visor_select.css';
import { ClickAndText, ComponentAndRefGetter } from './types';
declare type Props = {
    top: ClickAndText;
    left: ClickAndText;
    right: ClickAndText;
    radar: ComponentAndRefGetter;
    map: ComponentAndRefGetter;
};
export declare class VisorSelect extends React.Component<Props> {
    svgRef: React.RefObject<SVGElement>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    topDivRef: React.RefObject<HTMLAnchorElement>;
    leftDivRef: React.RefObject<HTMLAnchorElement>;
    rightDivRef: React.RefObject<HTMLAnchorElement>;
    hueRotation: number;
    constructor(props: Props);
    resizeListener: () => void;
    render(): JSX.Element;
    rescale(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export {};
