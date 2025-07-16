import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusCodes } from "http-status-codes";

import { AccountField } from "shared/constants/account/Field";
import useAccountProfile from "@/hooks/api/useAccountProfile";
import ButtonColour from "@/components/common/Button/Colour";
import Button from "@/components/common/Button";
import EmailVerifyDialog from "@/apps/settings/components/EmailChangeDialog";
import DetailUpdateDialog from "@/apps/settings/components/DetailUpdateDialog";

import * as styles from "./ManageAccount.module.css";

const accountStrings = "pages.settings.categories.account.manageAccount";

const deletionConfirmer = "delete account";

function ManageAccount() {
    const { t } = useTranslation();

    const { profile } = useAccountProfile();

    const [
        resetPasswordDialogOpen,
        setResetPasswordDialogOpen
    ] = useState(false);

    const [
        deleteAccountDialogOpen,
        setDeleteAccountDialogOpen
    ] = useState(false);

    async function resetPassword() {
        const updateResponse = await fetch("/auth/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                field: "password" satisfies AccountField
            })
        });

        if (updateResponse.status == StatusCodes.TOO_MANY_REQUESTS) {
            throw new Error(t("pages.signIn.errors.verificationCooldown"));
        } else if (!updateResponse.ok) {
            throw new Error(t("error"));
        }
    }

    async function deleteAccount() {
        const deleteResponse = await fetch("/auth/delete");

        if (!deleteResponse.ok) {
            throw new Error(t("error"));
        }

        location.href = "/signup";
    }

    return <div className={styles.wrapper}>
        {profile?.loginMethod == "email" && <Button
            className={styles.accountButton}
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={() => setResetPasswordDialogOpen(true)}
        >
            {t(`${accountStrings}.resetPassword`)}
        </Button>}

        {resetPasswordDialogOpen && <EmailVerifyDialog
            onClose={() => setResetPasswordDialogOpen(false)}
            onSendVerification={resetPassword}
        >
            {t(`${accountStrings}.resetPasswordDialog`)}
        </EmailVerifyDialog>}

        <Button
            className={styles.accountButton}
            style={{ backgroundColor: ButtonColour.RED }}
            onClick={() => setDeleteAccountDialogOpen(true)}
        >
            {t(`${accountStrings}.deleteAccount`)}
        </Button>

        {deleteAccountDialogOpen && <DetailUpdateDialog
            buttonStyle={{ backgroundColor: ButtonColour.RED }}
            onClose={() => setDeleteAccountDialogOpen(false)}
            onConfirm={deleteAccount}
            buttonDisabled={input => input != deletionConfirmer}
            placeholder={`${deletionConfirmer}...`}
        >
            <div className={styles.deleteAccountDialogMessage}>
                <span>{t(`${accountStrings}.deleteAccountDialog`)}</span>

                <span className={styles.deleteAccountConfirmation}>
                    {deletionConfirmer}
                </span>

                <span>{t(`${accountStrings}.irreversibleAction`)}</span>
            </div>
        </DetailUpdateDialog>}
    </div>;
}

export default ManageAccount;