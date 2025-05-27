import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "@components/Typography";
import ProfileConnectionIcon from "@apps/credits/constants/ProfileConnectionIcon";
import CreditsProfile from "@apps/credits/components/CreditsProfile";

import * as styles from "./Credits.module.css";

function Credits() {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <h1 className={styles.title}>
            The{" "}

            <Typography/>

            {" "}Team
        </h1>

        <h2>{t("pages.credits.leadDeveloper")}</h2>

        <CreditsProfile
            username="Wilson Crunden (wintrcat)"
            profileImage={require("@assets/img/credits/profiles/wintrcat.png")}
            connections={[
                {
                    icon: ProfileConnectionIcon.DOMAIN,
                    url: "https://wintrcat.uk/"
                },
                {
                    icon: ProfileConnectionIcon.GITHUB,
                    url: "https://github.com/wintrcat/"
                },
                {
                    icon: ProfileConnectionIcon.YOUTUBE,
                    url: "https://youtube.com/@wintrcat"
                }
            ]}
        />

        <h2>{t("pages.credits.developer")}</h2>

        <CreditsProfile
            username="Matthew Roberts (hetbet)"
            profileImage={require("@assets/img/credits/profiles/hetbet.png")}
            connections={[
                {
                    icon: ProfileConnectionIcon.GITHUB,
                    url: "https://github.com/hetbet/"
                }
            ]}
        />

        <h2>{t("pages.credits.artist")}</h2>

        <CreditsProfile
            username="Simona (0nlinegirl3)"
            profileImage={require("@assets/img/credits/profiles/simona.png")}
            connections={[
                {
                    icon: ProfileConnectionIcon.INSTAGRAM,
                    url: "https://www.instagram.com/0nlinegirl3"
                },
                {
                    icon: ProfileConnectionIcon.YOUTUBE,
                    url: "https://youtube.com/@0nlinegrl3"
                }
            ]}
        />
    </div>;
}

export default Credits;