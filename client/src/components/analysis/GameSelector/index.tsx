import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import GameSource from "@constants/GameSource";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import GameSearchMenu from "../GameSearchMenu";

import * as styles from "./GameSelector.module.css";

function GameSelector() {
    const { t } = useTranslation();

    const [ source, setSource ] = useState<GameSource>(GameSource.PGN);
    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    const inputGameRef = useRef<string>("");

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedSource = Object.values(GameSource)
            .find(source => source.key == event.target.value);

        if (!selectedSource) return;
        setSource(selectedSource);
    }

    function handleGameInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        inputGameRef.current = event.target.value;
    }

    function openGameSearchMenu() {
        if (inputGameRef.current.length == 0) return;
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
            placeholder={
                t(`pages.analysis.gameSelector.sourcePlaceholders.${source.key}`)
            }
            style={{
                height: source.expandField ? "170px" : "70px",
                borderRadius: source.requiresSearch ? undefined : "0 0 10px 10px"
            }}
            onChange={handleGameInputChange}
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
                username={inputGameRef.current}
                gameSource={source}
                setOpen={setSearchMenuOpen}
            />
        }
    </div>;
}

export default GameSelector;