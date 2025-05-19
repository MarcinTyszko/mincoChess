import React, { useEffect } from "react";

import AdvertisementProps from "./AdvertisementProps";

function Advertisement({
    style,
    adUnitId
}: AdvertisementProps) {
    useEffect(() => {
        window.adsbygoogle ??= [];
        window.adsbygoogle.push({});
    }, []);

    if (!process.env.ADS_PUBLISHER_ID) return null;

    return <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={process.env.ADS_PUBLISHER_ID}
        data-ad-slot={adUnitId}
    />;
}

export default Advertisement;