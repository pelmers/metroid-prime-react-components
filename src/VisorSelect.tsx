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
    topDivRef: React.RefObject<HTMLAnchorElement>;
    leftDivRef: React.RefObject<HTMLAnchorElement>;
    rightDivRef: React.RefObject<HTMLAnchorElement>;
    radarMask: PathNode[];
    mapMask: PathNode[];

    constructor(props: Props) {
        super(props);
        this.svgRef = React.createRef();
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
                <div className="visor-select-text-wrapper">
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
            let offset = 8;
            // Note firefox behaves differently from other browsers: it adds an extra padding around the shape for some reason
            // related: https://stackoverflow.com/questions/63406204/svg-paths-stroke-width-affecting-getboundingclientrect-results-in-firefox
            if (navigator.userAgent.includes('Firefox')) {
                offset *= 3;
            }
            ref.current.style.left = `${left + offset * scaleX}px`;
            ref.current.style.top = `${top + offset * scaleY}px`;
            ref.current.style.width = `${width}px`;
            ref.current.style.height = `${height}px`;
            const $maskPath = $maskElement.querySelector('path');
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
        this.rescale();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
}
