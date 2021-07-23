import React from 'react';
import './assets/masks.css';
import { PathNode } from './svg_path';
import { ComponentAndRefGetter } from './types';
declare type Props = {
    getScale: () => {
        x: number;
        y: number;
    };
    getSVG: () => SVGElement;
    radar: ComponentAndRefGetter;
    map: ComponentAndRefGetter;
};
export default class MasksCommon extends React.Component<Props> {
    radarMask: PathNode[];
    mapMask: PathNode[];
    constructor(props: Props);
    resizeListener: () => void;
    render(): JSX.Element;
    rescale(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
export {};
