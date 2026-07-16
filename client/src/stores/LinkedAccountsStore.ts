import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import LinkedAccounts from "shared/types/LinkedAccounts";

interface LinkedAccountsStore extends LinkedAccounts {
    serverSynced: boolean;

    setLinkedAccounts: (accounts: LinkedAccounts) => void;
    syncWithServer: () => Promise<void>;
}

/**
 * @description Usernames on external Chess services linked to the local
 * profile; stored in localStorage and mirrored to the account when the
 * user is signed in.
 */
const useLinkedAccountsStore = create<LinkedAccountsStore>()(
    persist(
        set => ({
            serverSynced: false,

            setLinkedAccounts(accounts) {
                set({
                    chessCom: accounts.chessCom || undefined,
                    lichess: accounts.lichess || undefined
                });

                fetch("/api/account/linked-accounts", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(accounts)
                }).catch(() => {
                    // Signed out or offline; localStorage still has them
                });
            },

            async syncWithServer() {
                try {
                    const accountsResponse = await fetch(
                        "/api/account/linked-accounts"
                    );

                    if (!accountsResponse.ok) return;

                    const accounts: LinkedAccounts
                        = await accountsResponse.json();

                    // The signed-in account is the source of truth -
                    // never keep values another user left in this
                    // browser's localStorage
                    set({
                        serverSynced: true,
                        chessCom: accounts.chessCom || undefined,
                        lichess: accounts.lichess || undefined
                    });
                } catch {
                    // Signed out or offline; keep local values
                }
            }
        }),
        {
            name: "wintrchess-linked-accounts",
            storage: createJSONStorage(() => localStorage),
            partialize: state => ({
                chessCom: state.chessCom,
                lichess: state.lichess
            })
        }
    )
);

export default useLinkedAccountsStore;
