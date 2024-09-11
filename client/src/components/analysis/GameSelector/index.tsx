import React, { useEffect, useState } from "react";
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
    const [ selectorInput, setSelectorInput ] = useState("");

    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    function getSavedSelectorInput(source: GameSource): string {
        return cookies.get(
            Cookie.LAST_GAME_SELECTOR_INPUTS
        )?.[source.key] || "";
    }

    useEffect(() => {
        // Load last game source from cookies
        const savedSourceKey = cookies.get(Cookie.LAST_GAME_SELECTOR_SOURCE);

        const savedSource = Object.values(GameSource)
            .find(source => source.key == savedSourceKey);

        if (!savedSource) return;
        
        setSource(savedSource);

        // Load last selector input from cookies
        setSelectorInput(
            getSavedSelectorInput(savedSource)
        );
    }, []);

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        // Get the selected game source from the dropdown
        const selectedSource = Object.values(GameSource)
            .find(source => source.key == event.target.value);
        
        if (!selectedSource) return;

        // Save the selected game source choice in cookies
        setSource(selectedSource);

        cookies.set(Cookie.LAST_GAME_SELECTOR_SOURCE, selectedSource.key);

        // Put the saved selector input from cookies into the text area
        setSelectorInput(
            getSavedSelectorInput(selectedSource)
        );
    }

    function handleSelectorFieldChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setSelectorInput(event.target.value);

        // Save the input field contents in cookies
        const savedSelectorInputs = cookies.get(Cookie.LAST_GAME_SELECTOR_INPUTS) || {};
        if (typeof savedSelectorInputs != "object") return;

        cookies.set(
            Cookie.LAST_GAME_SELECTOR_INPUTS,
            {
                ...savedSelectorInputs,
                [source.key]: event.target.value
            }
        );
    }

    function openGameSearchMenu() {
        if (selectorInput.length == 0) return;

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
            className={styles.selectorField}
            placeholder={
                t(`pages.analysis.gameSelector.sourcePlaceholders.${source.key}`)
            }
            style={{
                height: source.expandField ? "170px" : "70px",
                borderRadius: source.requiresSearch ? undefined : "0 0 10px 10px"
            }}
            value={selectorInput}
            onChange={handleSelectorFieldChange}
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
                username={selectorInput}
                gameSource={source}
                setOpen={setSearchMenuOpen}
            />
        }
    </div>;
}

export default GameSelector;