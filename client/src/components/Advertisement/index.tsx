import React, { useEffect } from "react";

import AdvertisementProps from "./AdvertisementProps";

function Advertisement({
    adUnitId,
    format
}: AdvertisementProps) {
    useEffect(() => {
        window.adsbygoogle ??= [];
        window.adsbygoogle.push({});
    }, []);

    if (!process.env.ADS_PUBLISHER_ID) return null;

    return <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.ADS_PUBLISHER_ID}
        data-ad-slot={adUnitId}
        data-ad-format={format}
        data-full-width-responsive="true"
    />;
}

export default Advertisement;