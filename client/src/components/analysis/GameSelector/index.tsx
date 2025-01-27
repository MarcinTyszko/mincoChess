import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cookies } from "react-cookie";

import { Cookie } from "wintrchess";
import GameSource from "@constants/GameSource";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import GameSearchMenu from "../GameSearchMenu";
import useGameSelectorStore from "@stores/GameSelectorStore";

import GameSelectorProps from "./GameSelectorProps";
import * as styles from "./GameSelector.module.css";

function GameSelector({ style }: GameSelectorProps) {
    const { t } = useTranslation();
    const cookies = new Cookies();

    const {
        selectedGameSource,
        setSelectedGameSource,
        selectedGameInput,
        setSelectedGameInput
    } = useGameSelectorStore();

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
        
        setSelectedGameSource(savedSource);

        // Load last selector input from cookies
        setSelectedGameInput(
            getSavedSelectorInput(savedSource)
        );
    }, []);

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        // Get the selected game source from the dropdown
        const selectedSource = Object.values(GameSource)
            .find(source => source.key == event.target.value);
        
        if (!selectedSource) return;

        // Save the selected game source choice in state
        setSelectedGameSource(selectedSource);

        // Save the selected game source choice in cookies
        cookies.set(Cookie.LAST_GAME_SELECTOR_SOURCE, selectedSource.key);

        // Put the saved selector input from cookies into the text area
        setSelectedGameInput(
            getSavedSelectorInput(selectedSource)
        );
    }

    function handleSelectorFieldChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setSelectedGameInput(event.target.value);

        // Save the input field contents in cookies
        const savedSelectorInputs = cookies.get(Cookie.LAST_GAME_SELECTOR_INPUTS) || {};
        if (typeof savedSelectorInputs != "object") return;

        cookies.set(
            Cookie.LAST_GAME_SELECTOR_INPUTS,
            {
                ...savedSelectorInputs,
                [selectedGameSource.key]: event.target.value
            }
        );
    }

    function openGameSearchMenu() {
        if (selectedGameInput.length == 0) return;

        setSearchMenuOpen(true);
    }

    return <div className={styles.wrapper} style={style}>
        <div className={styles.gameSourceSection}>
            <div className={styles.gameSourceLabel}>
                {t("pages.analysis.gameSelector.sourceLabel")}
            </div>

            <select 
                className={styles.gameSourceSelector}
                onChange={handleGameSourceChange}
                value={selectedGameSource.key}
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
                t(`pages.analysis.gameSelector.sourcePlaceholders.${selectedGameSource.key}`)
            }
            style={{
                height: selectedGameSource.expandField ? "170px" : "70px",
                borderRadius: selectedGameSource.requiresSearch ? undefined : "0 0 10px 10px"
            }}
            value={selectedGameInput}
            onChange={handleSelectorFieldChange}
        ></textarea>

        {
            selectedGameSource.requiresSearch
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
                username={selectedGameInput}
                gameSource={selectedGameSource}
                setOpen={setSearchMenuOpen}
            />
        }
    </div>;
}

export default GameSelector;