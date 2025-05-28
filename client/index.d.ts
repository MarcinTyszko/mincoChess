declare module "*.module.css";

declare interface Window {
    adsbygoogle: any[];
    googlefc: {
        callbackQueue: any[];
        showRevocationMessage: () => void;
    };
}