import React from "react";
import { useTranslation } from "react-i18next";

import Loader from "@components/common/Loader";

import * as styles from "./LoadingPlaceholder.module.css";

function LoadingPlaceholder() {
    const { t } = useTranslation();

    return <div className={styles.wrapper}>
        <Loader/>

        <span className={styles.message}>
            {t("loading")}
        </span>
    </div>;
}

export default LoadingPlaceholder;