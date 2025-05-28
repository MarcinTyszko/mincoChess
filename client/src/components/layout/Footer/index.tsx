import React from "react";
import { useTranslation } from "react-i18next";

import Typography from "@components/Typography";
import manageDataConsent from "@lib/consent";

import FooterProps from "./FooterProps";
import * as styles from "./Footer.module.css";

function Footer({ className, style }: FooterProps) {
    const { t } = useTranslation();

    return <footer
        className={`${styles.wrapper} ${className}`}
        style={style}
    >
        <div className={styles.section}>
            <Typography
                iconClassName={styles.typographyIcon}
                textClassName={styles.typographyText}
                includeIcon
            />

            <span className={styles.copyrightNotice}>
                Copyright © 2025 wintrchess.com
            </span>

            <span className={styles.copyrightNotice}>
                All rights reserved
            </span>
        </div>

        <div className={styles.links}>
            <div className={styles.section}>
                <a href="/help">{t("pages.helpCenter.title")}</a>
                <a href="/settings">{t("settings")}</a>
                <a className={styles.link} onClick={manageDataConsent}>
                    {t("footer.manageConsent")}
                </a>
            </div>

            <div className={styles.section}>
                <a href="/privacy">{t("footer.privacyPolicy")}</a>
                <a href="/credits">{t("footer.credits")}</a>
            </div>
        </div>
    </footer>;
}

export default Footer;