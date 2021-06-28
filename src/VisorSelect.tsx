import React from 'react';
// @ts-ignore svg loading handled by svgr
import VisorSelectSVG from './assets/visor_select.svg';
// @ts-ignore svg loading handled by svgr
import MapMaskSVG from './assets/map_mask.svg';
// @ts-ignore svg loading handled by svgr
import RadarMaskSVG from './assets/radar_mask.svg';

import './assets/visor_select.css';
import { parse, PathNode, serialize } from './svg_path';

const originalWidth = 1440;
const originalHeight = 1024;

type ClickAndText = {
    text: string;
    href?: string;
    onClick?: () => void;
};

type ComponentAndRefGetter = {
    component: JSX.Element;
    getRef: () => React.RefObject<HTMLElement>;
};

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
    radarMask: PathNode[];
    mapMask: PathNode[];

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
                <MapMaskSVG
                    className="visor-select-mask"
                    preserveAspectRatio="none"
                ></MapMaskSVG>
                <RadarMaskSVG
                    className="visor-select-mask"
                    preserveAspectRatio="none"
                ></RadarMaskSVG>
            </>
        );
    }

    rescale() {
        const { current } = this.svgRef;
        // Multiply original dimension by scale to get client viewport dimension
        const scaleX = current.getBoundingClientRect().width / originalWidth;
        const scaleY = current.getBoundingClientRect().height / originalHeight;
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

        for (const [box, maskId, ref, path] of [
            ['#map_fill', '#map_mask', this.props.map.getRef(), this.mapMask],
            ['#radar_fill', '#radar_mask', this.props.radar.getRef(), this.radarMask],
        ] as [string, string, React.RefObject<HTMLElement>, PathNode[]][]) {
            const $boxElement = current.querySelector<SVGGElement>(box);
            const $maskElement = document.querySelector(maskId);
            const { top, left, width, height } = $boxElement.getBoundingClientRect();
            ref.current.style.position = 'absolute';
            // The 8 referenced here is the stroke (border) of the frame,
            // and we want to position the mask so it starts inside of the border
            // Note that the browser only does an approximation for the bounding box of <path> elements,
            // so even though ideally this would be a perfect fit, in practice it could be a few px off
            let offset = 8;
            // Firefox behaves differently from other browsers: it adds an extra padding around the shape for some reason
            // multiplying by 3 is not very exact but it's pretty close from what I could tell
            // related: https://stackoverflow.com/questions/63406204/svg-paths-stroke-width-affecting-getboundingclientrect-results-in-firefox
            if (navigator.userAgent.includes('Firefox')) {
                offset *= 3;
            }
            ref.current.style.left = `${left + offset * scaleX}px`;
            ref.current.style.top = `${top + offset * scaleY}px`;
            ref.current.style.width = `${width}px`;
            ref.current.style.height = `${height}px`;
            const $maskPath = $maskElement.querySelector('path');
            // If using react-snap to pre-render the React, we want to make sure not to
            // overwrite the original attribute! If we skip this step then the result page
            // will have an error based on the difference between the react-snap
            // 'window' size and the original SVG's coordinate system
            if (window.navigator.userAgent !== 'ReactSnap') {
                $maskPath.setAttribute(
                    'd',
                    serialize(
                        path.map((n) => {
                            if ('x' in n) {
                                return { x: n.x * scaleX, y: n.y * scaleY };
                            } else {
                                return n;
                            }
                        })
                    )
                );
            }
            ref.current.style.clipPath = `url(${maskId})`;
        }
    }

    componentDidMount() {
        this.resizeListener = () => this.rescale();
        this.mapMask = parse(
            document.querySelector('#map_mask > path').getAttribute('d')
        );
        this.radarMask = parse(
            document.querySelector('#radar_mask > path').getAttribute('d')
        );
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
