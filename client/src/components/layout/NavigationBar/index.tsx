import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import { Cookies } from "react-cookie";

import { Cookie } from "wintrchess";
import languages from "@i18n/languages";
import useSidebarStore from "@stores/SidebarStore"; 
import Button from "@components/common/Button";
import Breakpoints from "@constants/Breakpoints";
import LanguageOption from "@ctypes/LanguageOption";

import LanguageSwitcher from "./LanguageSwitcher";
import FlagDisplayLabel from "./FlagDisplayLabel";
import * as styles from "./NavigationBar.module.css";

function NavigationBar() {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    const cookies = new Cookies();

    const { sidebarOpen, setSidebarOpen } = useSidebarStore();

    return <div className={styles.navigationBar}>
        <div className={styles.navigationBarSection}>
            {
                innerWidth <= Breakpoints.RETRACT_SIDEBAR
                && <img
                    className={styles.menuButton}
                    src={require("@assets/img/menu.svg")}
                    height={35}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                />
            }

            <img 
                src={require("@assets/img/logo.svg")}
                style={{
                    transform: "scaleX(-1)",
                    filter: "invert()"
                }}
                alt="WintrChess"
                title="WINTR"
                height={35}
                draggable={false}
            />

            <span className={styles.title}>
                WintrChess
            </span>
        </div>

        <div className={styles.navigationBarSection}>
            <a 
                href="https://ko-fi.com/wintrcat"
                target="_blank" 
                title={t("navigationBar.tooltips.support")}
            >
                <Button
                    style={{
                        background: "linear-gradient(-225deg,"
                            + "#22E1FF 0%, #1D8FE1 48%, #625EB1 100%)"
                    }}
                    icon={require("@assets/img/kofi.svg")}
                >
                    {t("navigationBar.support")}
                </Button>
            </a>

            <Select
                options={languages}
                defaultValue={languages.find(lang => lang.id == "en")}
                getOptionLabel={option => option.label}
                styles={{
                    control: baseStyles => ({
                        ...baseStyles,
                        width: "52px",
                        height: "42px",
                        backgroundColor: "#343434",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transitionDuration: "0.3s"
                    }),
                    singleValue: baseStyles => ({
                        ...baseStyles,
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center"
                    }),
                    menu: baseStyles => ({
                        ...baseStyles,
                        width: "200px",
                        left: "-148px",
                        backgroundColor: "#303030",
                        color: "white"
                    }),
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isFocused
                            ? "#242424"
                            : "#303030",
                        transitionDuration: "0.3s"
                    })
                }}
                components={{
                    Control: LanguageSwitcher,
                    SingleValue: FlagDisplayLabel,
                    DropdownIndicator: null
                }}
                isSearchable={false}
                onChange={option => {
                    option = option as SingleValue<LanguageOption>;

                    if (!option?.id) return;

                    i18n.changeLanguage(option.id);

                    cookies.set(Cookie.PREFERRED_LANGUAGE, option.id);
                }}
            />

            <Button
                icon={require("@assets/img/help.svg")}
                style={{
                    width: "52px",
                    padding: "5px"
                }}
                iconSize="32px"
                tooltip={t("navigationBar.tooltips.help")}
                onClick={() => navigate("/help")}
            />
        </div>
    </div>;
}

export default NavigationBar;