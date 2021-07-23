export type ClickAndText = {
    text: string;
    href?: string;
    onClick?: () => void;
};

export type ComponentAndRefGetter = {
    component: JSX.Element;
    getRef: () => React.RefObject<HTMLElement>;
};
