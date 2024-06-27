import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { GameSource } from "wintrchess";
import gameSources from "@constants/GameSource";

import * as styles from "./GameSelector.module.css";

function GameSelector() {
    const { t } = useTranslation();

    const [ gameSource, setGameSource ] = useState<GameSource>(gameSources.pgn);

    function handleGameSourceChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setGameSource(gameSources[event.target.value]);
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
            placeholder={
                t(`pages.analysis.gameSelector.sourcePlaceholders.${gameSource.key}`)
            }
            style={{
                height: gameSource.expandField ? "170px" : "45px"
            }}
        ></textarea>
    </div>;
}

export default GameSelector;