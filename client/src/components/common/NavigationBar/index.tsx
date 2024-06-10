import React from "react";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";

import * as styles from "./NavigationBar.module.css";

function NavigationBar() {
    return <div className={styles.navigationBar}>
        <div className={styles.navigationBarSection}>
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
                    options={{ fontSize: "1.2rem" }}
                >
                    Donate
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