import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { StatusCodes } from "http-status-codes";

import Separator from "@/components/common/Separator";
import LogMessage from "@/components/common/LogMessage";
import LoadingPlaceholder from "@/components/layout/LoadingPlaceholder";
import { getArchivedGames } from "@/lib/api/gameArchive";
import GameListing from "@/components/chess/GameListing";

import * as styles from "./Archive.module.css";

import iconArchive from "@assets/img/icons/archive.png";

function Archive() {
    const { t } = useTranslation(["otherPages", "common"]);

    const { data: archive, status } = useQuery({
        queryKey: ["archive"],
        queryFn: async () => {
            const games = await getArchivedGames();
            if (games.status != StatusCodes.OK) throw new Error();

            return games;
        },
        refetchOnWindowFocus: false,
        retry: false
    });

    const [ selectedGameIds, setSelectedGameIds ] = useState<string[]>([]);

    return <div className={styles.wrapper}>
        <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <span className={styles.title}>
                    <img src={iconArchive} height={24} />

                    {t("archive.title") + " "}
                    
                    ({archive?.games
                        ? Object.keys(archive.games).length
                        : "..."
                    })
                </span>

                {archive?.games && selectedGameIds.length > 0
                    && <span className={styles.selection}>
                        {t("archive.selected", {
                            amount: selectedGameIds.length
                        })}

                        <a onClick={() => setSelectedGameIds(
                            Object.keys(archive.games)
                        )}>
                            {t("archive.selectAll")}
                        </a>
                    </span>
                }
            </div>

            <div className={styles.toolbarRight}>
                
            </div>
        </div>

        <Separator/>

        {status == "error" && <LogMessage>
            {t("archive.error")}
        </LogMessage>}

        {status == "pending" && <LoadingPlaceholder/>}

        <div className={styles.games}>
            {archive?.games && Object.entries(archive.games).map(
                ([ id, game ]) => <GameListing
                    style={{ justifyContent: "start" }}
                    game={game}
                    selected={selectedGameIds.includes(id)}
                    onClick={() => location.href = `/analysis?game=${id}`}
                    onSelect={selected => {
                        if (selected) return setSelectedGameIds([
                            ...selectedGameIds, id
                        ]);

                        setSelectedGameIds(selectedGameIds.filter(
                            selectedId => selectedId != id
                        ));
                    }}
                />
            )}
        </div>
    </div>;
}

export default Archive;