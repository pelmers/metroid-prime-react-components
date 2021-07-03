import React from 'react';
// @ts-ignore svg loading handled by svgr
import VisorSelectSVG from './assets/visor_select.svg';

import './assets/visor_select.css';
import { ClickAndText, ComponentAndRefGetter } from './types';
import MasksCommon from './MasksCommon';

const originalWidth = 1440;
const originalHeight = 1024;

type Props = {
    top: ClickAndText;
    left: ClickAndText;
    right: ClickAndText;
    radar: ComponentAndRefGetter;
    map: ComponentAndRefGetter;
};

export class VisorSelect extends React.Component<Props> {
    svgRef: React.RefObject<SVGElement>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    topDivRef: React.RefObject<HTMLAnchorElement>;
    leftDivRef: React.RefObject<HTMLAnchorElement>;
    rightDivRef: React.RefObject<HTMLAnchorElement>;

    hueRotation: number = 0;

    constructor(props: Props) {
        super(props);
        this.svgRef = React.createRef();
        this.wrapperRef = React.createRef();
        this.topDivRef = React.createRef();
        this.leftDivRef = React.createRef();
        this.rightDivRef = React.createRef();
    }

    resizeListener: () => void;

    render() {
        return (
            <>
                <VisorSelectSVG
                    ref={this.svgRef}
                    className="visor_select"
                    preserveAspectRatio="none"
                />
                <div className="visor-select-text-wrapper" ref={this.wrapperRef}>
                    {[
                        { prop: this.props.top, ref: this.topDivRef },
                        { prop: this.props.left, ref: this.leftDivRef },
                        { prop: this.props.right, ref: this.rightDivRef },
                    ].map(({ prop, ref }, index) => {
                        const { text, onClick, href } = prop;
                        return (
                            <a
                                className="visor-select-text"
                                ref={ref}
                                onClick={onClick}
                                href={href}
                                key={index}
                            >
                                <div>{text}</div>
                            </a>
                        );
                    })}
                    {this.props.map.component}
                    {this.props.radar.component}
                </div>
                <MasksCommon
                    radar={this.props.radar}
                    map={this.props.map}
                    getSVG={() => this.svgRef.current}
                    getScale={() => {
                        const { width, height } =
                            this.svgRef.current.getBoundingClientRect();
                        // Multiply original dimension by scale to get client viewport dimension
                        return {
                            x: width / originalWidth,
                            y: height / originalHeight,
                        };
                    }}
                />
            </>
        );
    }

    rescale() {
        const { current } = this.svgRef;
        for (const [box, ref] of [
            ['#top_text_box', this.topDivRef],
            ['#left_text_box', this.leftDivRef],
            ['#right_text_box', this.rightDivRef],
        ] as [string, React.RefObject<HTMLAnchorElement>][]) {
            const $boxElement = current.querySelector<SVGGElement>(box);
            $boxElement.style.display = 'block';
            const { top, left, width, height } = $boxElement.getBoundingClientRect();
            ref.current.style.left = `${left}px`;
            ref.current.style.top = `${top}px`;
            ref.current.style.width = `${width}px`;
            ref.current.style.height = `${height}px`;
            // We hide the SVG box because we're putting an regular div on top,
            // that lets us add a perspective filter to make it look more 3-D
            $boxElement.style.display = 'none';
        }
    }

    componentDidMount() {
        this.resizeListener = () => this.rescale();
        this.topDivRef.current.style.transform = 'rotateX(-30deg)';
        this.leftDivRef.current.style.transform = 'rotateY(25deg) rotateX(5deg)';
        this.rightDivRef.current.style.transform = 'rotateY(-25deg) rotateX(5deg)';

        window.addEventListener('resize', this.resizeListener);
        this.svgRef.current
            .querySelector('#inner_circle')
            .addEventListener('click', () => {
                this.hueRotation = (this.hueRotation + 30) % 360;
                this.svgRef.current.style.filter = `hue-rotate(${this.hueRotation}deg)`;
                this.wrapperRef.current.style.filter = `hue-rotate(${this.hueRotation}deg)`;
            });

        this.rescale();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
}
