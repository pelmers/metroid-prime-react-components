import React from 'react';
// @ts-ignore svg loading handled by svgr
import MapMaskSVG from './assets/map_mask.svg';
// @ts-ignore svg loading handled by svgr
import RadarMaskSVG from './assets/radar_mask.svg';

import './assets/masks.css';
import { parse, PathNode, serialize } from './svg_path';
import { ComponentAndRefGetter } from './types';

type Props = {
    getScale: () => { x: number; y: number };
    getSVG: () => SVGElement;
    radar: ComponentAndRefGetter;
    map: ComponentAndRefGetter;
};

export default class MasksCommon extends React.Component<Props> {
    radarMask: PathNode[];
    mapMask: PathNode[];

    constructor(props: Props) {
        super(props);
    }

    resizeListener: () => void;

    render() {
        return (
            <>
                <MapMaskSVG
                    className="helmet-hud-mask"
                    preserveAspectRatio="none"
                ></MapMaskSVG>
                <RadarMaskSVG
                    className="helmet-hud-mask"
                    preserveAspectRatio="none"
                ></RadarMaskSVG>
            </>
        );
    }

    rescale() {
        const { x, y } = this.props.getScale();
        const current = this.props.getSVG();
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
            ref.current.style.left = `${left + offset * x}px`;
            ref.current.style.top = `${top + offset * y}px`;
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
                                return { x: n.x * x, y: n.y * y };
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
        window.addEventListener('resize', this.resizeListener);
        this.rescale();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
}
