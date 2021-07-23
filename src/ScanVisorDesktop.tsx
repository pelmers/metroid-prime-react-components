import React from 'react';

// @ts-ignore svg loading handled by svgr
import ScanVisorDesktopSVG from './assets/scan_visor.svg';

import './assets/common.css';
import './assets/scan_visor_desktop.css';

export type ScanVisorDesktopProps = {
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

    constructor(props: ScanVisorDesktopProps) {
        super(props);
        this.svgRef = React.createRef();
        this.wrapperRef = React.createRef();
        this.centerDivRef = React.createRef();
        this.descriptionDivRef = React.createRef();
        this.leftDivRef = React.createRef();
        this.rightDivRef = React.createRef();
        this.energyTextRef = React.createRef();
    }

    resizeListener: () => void;

    render() {
        const { leftPanel, rightPanel, centerPanel, descriptionPanel, energyValue } =
            this.props;
        return (
            <>
                <ScanVisorDesktopSVG
                    ref={this.svgRef}
                    className="helmet_hud"
                    preserveAspectRatio="none"
                />
                <div className="scan-visor-content-wrapper" ref={this.wrapperRef}>
                    {[
                        { child: leftPanel, ref: this.leftDivRef },
                        { child: rightPanel, ref: this.rightDivRef },
                        { child: centerPanel, ref: this.centerDivRef },
                        { child: descriptionPanel, ref: this.descriptionDivRef },
                    ].map(({ child, ref }, index) => (
                        <div className="scan-visor-content" ref={ref} key={index}>
                            {child}
                        </div>
                    ))}
                    <div
                        className="scan-visor-content scan-visor-energy-value"
                        ref={this.energyTextRef}
                    >
                        {energyValue}
                    </div>
                </div>
            </>
        );
    }

    rescale() {
        const { current } = this.svgRef;
        for (const [box, ref] of [
            ['#left_panel_box', this.leftDivRef],
            ['#right_panel_box', this.rightDivRef],
            ['#center_panel_box', this.centerDivRef],
            ['#description_box', this.descriptionDivRef],
            ['#energy_text', this.energyTextRef],
        ] as [string, React.RefObject<HTMLDivElement>][]) {
            const $boxElement = current.querySelector<SVGGElement>(box);
            $boxElement.style.display = 'block';
            const { top, left, width, height } = $boxElement.getBoundingClientRect();
            ref.current.style.left = `${left}px`;
            ref.current.style.top = `${top}px`;
            ref.current.style.width = `${width}px`;
            ref.current.style.height = `${height}px`;
            // We hide the SVG box because we're putting an regular div on top,
            // that lets us add a perspective filter to make it look more 3-D
            $boxElement.style.fillOpacity = '0';
        }
        this.energyTextRef.current.style.fontSize =
            this.energyTextRef.current.style.height;
    }

    componentDidMount() {
        this.resizeListener = () => this.rescale();
        this.leftDivRef.current.style.transform = 'rotateY(30deg)';
        this.rightDivRef.current.style.transform = 'rotateY(-30deg)';
        this.energyTextRef.current.style.transform = 'rotateX(-10deg) rotateY(-15deg)';

        window.addEventListener('resize', this.resizeListener);

        this.rescale();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
}

// TODO progress bar animation/fill
