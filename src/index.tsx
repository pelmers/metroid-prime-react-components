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
    onClick: () => void;
};

type ClickAndSrc = {
    src: string;
    onClick: () => void;
};

type Props = {
    className?: string;
    top: ClickAndText;
    left: ClickAndText;
    right: ClickAndText;
    radar: ClickAndSrc;
    map: ClickAndSrc;
};

export class VisorSelect extends React.Component<Props> {
    svgRef: React.RefObject<SVGElement>;
    leftDivRef: React.RefObject<HTMLDivElement>;
    rightDivRef: React.RefObject<HTMLDivElement>;
    topDivRef: React.RefObject<HTMLDivElement>;
    radarImgRef: React.RefObject<HTMLImageElement>;
    mapImgRef: React.RefObject<HTMLImageElement>;
    radarMask: PathNode[];
    mapMask: PathNode[];

    resizeListener: () => void;

    render() {
        this.svgRef = React.createRef();
        this.leftDivRef = React.createRef();
        this.rightDivRef = React.createRef();
        this.topDivRef = React.createRef();
        this.radarImgRef = React.createRef();
        this.mapImgRef = React.createRef();

        return (
            <>
                <VisorSelectSVG
                    ref={this.svgRef}
                    className={this.props.className}
                    preserveAspectRatio="none"
                />
                <div className="visor-select-text-wrapper">
                    <div
                        className="visor-select-text"
                        ref={this.leftDivRef}
                        onClick={this.props.left.onClick}
                    >
                        <div>{this.props.left.text}</div>
                    </div>
                    <div
                        className="visor-select-text"
                        ref={this.rightDivRef}
                        onClick={this.props.right.onClick}
                    >
                        <div>{this.props.right.text}</div>
                    </div>
                    <div
                        className="visor-select-text"
                        ref={this.topDivRef}
                        onClick={this.props.top.onClick}
                    >
                        <div>{this.props.top.text}</div>
                    </div>
                    <img
                        className="visor-select-masked-image"
                        ref={this.radarImgRef}
                        src={this.props.radar.src}
                        onClick={this.props.radar.onClick}
                    ></img>
                    <img
                        className="visor-select-masked-image"
                        ref={this.mapImgRef}
                        src={this.props.map.src}
                        onClick={this.props.map.onClick}
                    ></img>
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
        const scaleX = current.clientWidth / originalWidth;
        const scaleY = current.clientHeight / originalHeight;
        console.log('enter rescale!', scaleX, scaleY);
        for (const [box, ref] of [
            ['#top_text_box', this.topDivRef],
            ['#left_text_box', this.leftDivRef],
            ['#right_text_box', this.rightDivRef],
        ] as [string, React.RefObject<HTMLDivElement>][]) {
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
            ['#map_fill', '#map_mask', this.mapImgRef, this.mapMask],
            ['#radar_fill', '#radar_mask', this.radarImgRef, this.radarMask],
        ] as [string, string, React.RefObject<HTMLImageElement>, PathNode[]][]) {
            const $boxElement = current.querySelector<SVGGElement>(box);
            const $maskElement = document.querySelector(maskId);
            const { top, left, width, height } = $boxElement.getBoundingClientRect();
            ref.current.style.position = 'absolute';
            // The 8 referenced here is the stroke (border) of the frame,
            // and we want to position the mask so it starts inside of the border
            ref.current.style.left = `${left + 8 * scaleX}px`;
            ref.current.style.top = `${top + 8 * scaleY}px`;
            ref.current.style.width = `${width + 8 * scaleX}px`;
            ref.current.style.height = `${height + 8 * scaleY}px`;
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
