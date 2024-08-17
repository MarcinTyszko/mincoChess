import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cookies } from "react-cookie";

import { Cookie } from "wintrchess";
import GameSource from "@constants/GameSource";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import GameSearchMenu from "../GameSearchMenu";

import * as styles from "./GameSelector.module.css";

function GameSelector() {
    const { t } = useTranslation();
    const cookies = new Cookies();

    const [ source, setSource ] = useState<GameSource>(GameSource.PGN);
    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    const inputGameRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Load last game source from cookies if one is stored
        const lastUsedGameSourceKey = cookies.get(Cookie.LAST_USED_GAME_SOURCE);

        const savedSource = Object.values(GameSource).find(source => {
            return source.key == lastUsedGameSourceKey;
        });

        if (savedSource) {
            setSource(savedSource);
        }
    }, []);

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        // Get the selected game source from the dropdown
        const selectedSource = Object.values(GameSource)
            .find(source => source.key == event.target.value);
        if (!selectedSource) return;

        // Save the selected game source choice in cookies
        setSource(selectedSource);
        cookies.set(Cookie.LAST_USED_GAME_SOURCE, selectedSource.key);

        // Put the saved chess website username from cookies into the text area
        if (!inputGameRef.current) return;

        inputGameRef.current.value = cookies.get(
            Cookie.LAST_CHESS_WEBSITE_USERNAME
        )?.[selectedSource.key] || "";
    }

    function handleGameInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        if (
            source.key == GameSource.PGN.key 
            || source.key == GameSource.FEN.key
        ) return;

        // Get saved chess website usernames from cookies
        const savedUsernames = cookies.get(Cookie.LAST_CHESS_WEBSITE_USERNAME) || {};
        if (typeof savedUsernames != "object") return;

        // Save the input field contents in cookies
        cookies.set(
            Cookie.LAST_CHESS_WEBSITE_USERNAME,
            {
                ...savedUsernames,
                [source.key]: event.target.value
            }
        );
    }

    function openGameSearchMenu() {
        if (!inputGameRef.current) return;

        // Don't open search menu if input game field is empty
        if (inputGameRef.current.value.length == 0) return;

        setSearchMenuOpen(true);
    }

    return <div className={styles.wrapper}>
        <div className={styles.gameSourceSection}>
            <div className={styles.gameSourceLabel}>
                {t("pages.analysis.gameSelector.sourceLabel")}
            </div>

            <select 
                className={styles.gameSourceSelector}
                onChange={handleGameSourceChange}
                value={source.key}
            >
                {
                    Object.values(GameSource)
                        .map(source => <option value={source.key}>
                            {source.title}
                        </option>)
                }
            </select>
        </div>

        <textarea
            className={styles.inputGame}
            ref={inputGameRef}
            placeholder={
                t(`pages.analysis.gameSelector.sourcePlaceholders.${source.key}`)
            }
            style={{
                height: source.expandField ? "170px" : "70px",
                borderRadius: source.requiresSearch ? undefined : "0 0 10px 10px"
            }}
            onChange={handleGameInputChange}
            defaultValue={
                cookies.get(Cookie.LAST_CHESS_WEBSITE_USERNAME)?.[source.key]
                || ""
            }
        ></textarea>

        {
            source.requiresSearch
            && <Button
                icon={require("@assets/img/search.svg")}
                iconSize="25px"
                style={{
                    backgroundColor: ButtonColour.LIGHT_GREY,
                    borderRadius: "0 0 10px 10px"
                }}
                onClick={openGameSearchMenu}
            >
                {t("pages.analysis.gameSelector.searchGamesButton")}
            </Button>
        }
        
        {
            searchMenuOpen
            && <GameSearchMenu
                username={inputGameRef.current?.value || ""}
                gameSource={source}
                setOpen={setSearchMenuOpen}
            />
        }
    </div>;
}

export default GameSelector;