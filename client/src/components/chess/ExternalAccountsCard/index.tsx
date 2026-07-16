import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import useLinkedAccountsStore from "@/stores/LinkedAccountsStore";

import * as styles from "./ExternalAccountsCard.module.css";

interface ExternalProfile {
    service: "chessCom" | "lichess";
    username: string;
    avatar?: string;
    url: string;
    gamesPlayed?: number;
    ratings: { label: string; rating?: number }[];
}

async function fetchChessComProfile(
    username: string
): Promise<ExternalProfile> {
    const [profileResponse, statsResponse] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${username}`),
        fetch(`https://api.chess.com/pub/player/${username}/stats`)
    ]);

    if (!profileResponse.ok) throw new Error();

    const profile = await profileResponse.json();
    const stats = statsResponse.ok ? await statsResponse.json() : {};

    const gamesPlayed = ["chess_bullet", "chess_blitz", "chess_rapid"]
        .map(key => {
            const record = stats[key]?.record;

            return record
                ? (record.win || 0) + (record.loss || 0) + (record.draw || 0)
                : 0;
        })
        .reduce((total, count) => total + count, 0);

    return {
        service: "chessCom",
        username: profile.username || username,
        avatar: profile.avatar,
        url: profile.url || `https://www.chess.com/member/${username}`,
        gamesPlayed: gamesPlayed || undefined,
        ratings: [
            { label: "Bullet", rating: stats.chess_bullet?.last?.rating },
            { label: "Blitz", rating: stats.chess_blitz?.last?.rating },
            { label: "Rapid", rating: stats.chess_rapid?.last?.rating }
        ]
    };
}

async function fetchLichessProfile(
    username: string
): Promise<ExternalProfile> {
    const userResponse = await fetch(
        `https://lichess.org/api/user/${username}`
    );

    if (!userResponse.ok) throw new Error();

    const user = await userResponse.json();

    return {
        service: "lichess",
        username: user.username || username,
        url: user.url || `https://lichess.org/@/${username}`,
        gamesPlayed: user.count?.all,
        ratings: [
            { label: "Bullet", rating: user.perfs?.bullet?.rating },
            { label: "Blitz", rating: user.perfs?.blitz?.rating },
            { label: "Rapid", rating: user.perfs?.rapid?.rating }
        ]
    };
}

const serviceTitles = {
    chessCom: "Chess.com",
    lichess: "Lichess"
};

function ProfileRow({ profile }: { profile: ExternalProfile }) {
    const { t } = useTranslation("otherPages");

    return <a
        className={styles.profileRow}
        href={profile.url}
        target="_blank"
        rel="noreferrer"
    >
        {profile.avatar
            ? <img className={styles.avatar} src={profile.avatar} />
            : <div className={styles.avatarPlaceholder}>♟</div>
        }

        <div className={styles.profileInfo}>
            <span className={styles.service}>
                {serviceTitles[profile.service]}
            </span>

            <span className={styles.username}>{profile.username}</span>

            {profile.gamesPlayed != undefined
                && <span className={styles.gamesPlayed}>
                    {t("externalAccounts.gamesPlayed", {
                        count: profile.gamesPlayed
                    })}
                </span>
            }
        </div>

        <div className={styles.ratings}>
            {profile.ratings.map(({ label, rating }) => <div
                key={label}
                className={styles.rating}
            >
                <span className={styles.ratingValue}>
                    {rating ?? "–"}
                </span>

                <span className={styles.ratingLabel}>{label}</span>
            </div>)}
        </div>
    </a>;
}

/**
 * @description Linked chess.com / lichess profiles with live avatars
 * and ratings, fetched from the services' public APIs.
 */
function ExternalAccountsCard() {
    const { t } = useTranslation("otherPages");

    const { chessCom, lichess, syncWithServer } = useLinkedAccountsStore();

    useEffect(() => {
        syncWithServer();
    }, []);

    const { data: profiles } = useQuery({
        queryKey: ["externalProfiles", chessCom, lichess],
        queryFn: async () => {
            const results = await Promise.allSettled([
                chessCom
                    ? fetchChessComProfile(chessCom)
                    : Promise.reject(new Error()),
                lichess
                    ? fetchLichessProfile(lichess)
                    : Promise.reject(new Error())
            ]);

            return results
                .filter(result => result.status == "fulfilled")
                .map(result => result.value);
        },
        enabled: !!(chessCom || lichess),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    if (!chessCom && !lichess) return null;

    return <div className={styles.wrapper}>
        <div className={styles.title}>
            {t("externalAccounts.title")}
        </div>

        {profiles?.map(profile => <ProfileRow
            key={profile.service}
            profile={profile}
        />)}
    </div>;
}

export default ExternalAccountsCard;
