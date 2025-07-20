import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "@/components/Typography";
import ProfileConnectionIcon from "@/apps/footer/credits/constants/ProfileConnectionIcon";
import CreditsProfile from "@/apps/footer/credits/components/CreditsProfile";

import * as styles from "./Credits.module.css";

import iconCreditsProfilesWintrcat from "@assets/img/credits/profiles/wintrcat.png";
import iconCreditsProfilesHetbet from "@assets/img/credits/profiles/hetbet.png";
import iconCreditsProfilesSimona from "@assets/img/credits/profiles/simona.png";

function Credits() {
    const { t } = useTranslation("otherPages");

    return <div className={styles.wrapper}>
        <h1 className={styles.title}>
            The{" "}

            <Typography/>

            {" "}Team
        </h1>

        <h2>{t("credits.leadDeveloper")}</h2>

        <CreditsProfile
            username="Wilson Crunden (wintrcat)"
            profileImage={iconCreditsProfilesWintrcat}
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

        <h2>{t("credits.developer")}</h2>

        <CreditsProfile
            username="Matthew Roberts (hetbet)"
            profileImage={iconCreditsProfilesHetbet}
            connections={[
                {
                    icon: ProfileConnectionIcon.GITHUB,
                    url: "https://github.com/hetbet/"
                }
            ]}
        />

        <h2>{t("credits.artist")}</h2>

        <CreditsProfile
            username="Simona (0nlinegirl3)"
            profileImage={iconCreditsProfilesSimona}
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