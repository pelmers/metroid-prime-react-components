import React from 'react';
import ScanVisorDesktop, { ScanVisorDesktopProps } from './ScanVisorDesktop';
import ScanVisorMobile from './ScanVisorMobile';

const MOBILE_WIDTH_LIMIT_PX = 800;

type State = {
    isMobile: boolean;
};

export default class ScanVisor extends React.Component<ScanVisorDesktopProps, State> {
    state = { isMobile: false };

    resizeListener: () => void;

    render() {
        const { leftPanel, rightPanel, centerPanel, descriptionPanel, energyValue } =
            this.props;
        if (this.state.isMobile) {
            return (
                <ScanVisorMobile
                    centerPanel={centerPanel}
                    descriptionPanel={descriptionPanel}
                    energyValue={energyValue}
                />
            );
        }
        return (
            <ScanVisorDesktop
                leftPanel={leftPanel}
                rightPanel={rightPanel}
                centerPanel={centerPanel}
                descriptionPanel={descriptionPanel}
                energyValue={energyValue}
            />
        );
    }

    componentDidMount() {
        this.resizeListener = () => {
            this.setState({ isMobile: window.innerWidth < MOBILE_WIDTH_LIMIT_PX });
        };
        window.addEventListener('resize', this.resizeListener);

        this.resizeListener();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }
}
