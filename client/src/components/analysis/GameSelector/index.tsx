import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import GameSource from "@ctypes/GameSource";
import gameSources from "@constants/GameSource";
import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";
import GameSearchMenu from "../GameSearchMenu";

import * as styles from "./GameSelector.module.css";

function GameSelector() {
    const { t } = useTranslation();

    const [ source, setSource ] = useState<GameSource>(gameSources.pgn);
    const [ searchMenuOpen, setSearchMenuOpen ] = useState<boolean>(false);

    const gameInputFieldRef = useRef<HTMLTextAreaElement>(null);

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setSource(gameSources[event.target.value]);
    }

    function openGameSearchMenu() {
        if (!gameInputFieldRef.current) return;
        if (gameInputFieldRef.current.value.length == 0) return;

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
                    Object.entries(gameSources)
                        .map(([key, data]) => <option value={key}>
                            {data.title}
                        </option>)
                }
            </select>
        </div>

        <textarea
            className={styles.inputGame}
            ref={gameInputFieldRef}
            placeholder={
                t(`pages.analysis.gameSelector.sourcePlaceholders.${source.key}`)
            }
            style={{
                height: source.expandField ? "170px" : "70px",
                borderRadius: source.requiresSearch ? undefined : "0 0 10px 10px"
            }}
        ></textarea>

        {
            source.requiresSearch ?
                <Button
                    colour={ButtonColour.LIGHT_GREY}
                    icon={require("@assets/img/search.svg")}
                    options={{
                        iconSize: "25px"
                    }}
                    style={{
                        borderRadius: "0 0 10px 10px"
                    }}
                    onClick={openGameSearchMenu}
                >
                    {t("pages.analysis.gameSelector.searchGamesButton")}
                </Button>
                : ""
        }
        
        {
            searchMenuOpen ?
                <GameSearchMenu
                    username={gameInputFieldRef.current?.value || ""}
                    gameSource={source}
                    setOpen={setSearchMenuOpen}
                />
                : ""
        }
    </div>;
}

export default GameSelector;