import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Hook, Unhook } from "console-feed";

import * as styles from "./BugReportingWidget.module.css";

function BugReportingWidget() {
    const { t } = useTranslation("common");

    const bugReportingLogsRef = useRef<any[]>([]);
    
    useEffect(() => {
        const hookedConsole = Hook(
            console,
            log => bugReportingLogsRef.current.push(log),
            false
        );

        return () => {
            Unhook(hookedConsole);
        };
    }, []);

    return <div
        className={styles.bugReportWidget}
        title={t("bugReportWidget.tooltip")}
        onClick={() => {
            navigator.clipboard.writeText(
                JSON.stringify(bugReportingLogsRef.current, undefined, 4)
            );

            toast.success(
                t("bugReportWidget.toast"),
                {
                    position: "bottom-left",
                    theme: "dark",
                    pauseOnHover: false,
                    closeOnClick: true,
                    closeButton: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    style: {
                        fontFamily: "JetBrains Mono"
                    }
                }
            );
        }}
    >
        <img src={require("@assets/img/interface/copy.svg")} />
    </div>;
}

export default BugReportingWidget;