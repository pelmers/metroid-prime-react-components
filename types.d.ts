/// <reference types="react" />
export declare type ClickAndText = {
    text: string;
    href?: string;
    onClick?: () => void;
};
export declare type ComponentAndRefGetter = {
    component: JSX.Element;
    getRef: () => React.RefObject<HTMLElement>;
};
