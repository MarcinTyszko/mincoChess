import React from "react";
import { useTranslation } from "react-i18next";

import useSidebarStore from "@stores/SidebarStore";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";

import * as styles from "./NavigationBar.module.css";

function NavigationBar() {
    const { t } = useTranslation();
    const { sidebarOpen, setSidebarOpen } = useSidebarStore();

    function handleMenuButtonClick() {
        setSidebarOpen(!sidebarOpen);
    }

    return <div className={styles.navigationBar}>
        <div className={styles.navigationBarSection}>
            <img
                className={styles.menuButton}
                src={require("@assets/img/menu.svg")}
                height={35}
                onClick={handleMenuButtonClick}
            />

            <img 
                src={require("@assets/img/logo.png")} 
                alt="WintrChess"
                height={50}
            />

            <span className={styles.title}>WintrChess</span>
        </div>

        <div className={styles.navigationBarSection}>
            <a href="https://ko-fi.com/wintrcat" target="_blank" title="Donate ❤">
                <Button 
                    colour={ButtonColour.BLUE} 
                    icon={require("@assets/img/kofi.svg")}
                >
                    {t("navigationBar.donate")}
                </Button>
            </a>

            <a href="https://youtube.com/@wintrcat" target="_blank" title="My YouTube Channel">
                <Button 
                    colour={ButtonColour.GREY} 
                    icon={require("@assets/img/youtube.svg")}
                />
            </a>

            <a href="https://discord.gg/XxtsAzPyCb" target="_blank" title="Join the community">
                <Button 
                    colour={ButtonColour.GREY} 
                    icon={require("@assets/img/discord.png")}
                />
            </a>
        </div>
    </div>;
}

export default NavigationBar;