import React, { useEffect } from "react";

import AdvertisementProps from "./AdvertisementProps";
import * as styles from "./Advertisement.module.css";

function Advertisement({
    className,
    style,
    adUnitId
}: AdvertisementProps) {
    useEffect(() => {
        window.adsbygoogle ??= [];
        window.adsbygoogle.push({});
    }, []);

    if (!process.env.ADS_PUBLISHER_ID) return null;

    const devStyles = process.env.NODE_ENV == "development"
        ? styles.dev : "";

    return <div className={className} style={style}>
        <ins
            className={`adsbygoogle ${devStyles}`}
            style={{ display: "block" }}
            data-ad-client={process.env.ADS_PUBLISHER_ID}
            data-ad-slot={adUnitId}
        />
    </div>;
}

export default Advertisement;