import React from 'react';
import './assets/visor_select.css';
import { PathNode } from './svg_path';
declare type ClickAndText = {
    text: string;
    href?: string;
    onClick?: () => void;
};
declare type ComponentAndRefGetter = {
    component: JSX.Element;
    getRef: () => React.RefObject<HTMLElement>;
};
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
    radarMask: PathNode[];
    mapMask: PathNode[];
    hueRotation: number;
    constructor(props: Props);
    resizeListener: () => void;
    render(): JSX.Element;
    rescale(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export {};
