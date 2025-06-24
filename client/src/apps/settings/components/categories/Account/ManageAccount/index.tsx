import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonColour from "@components/common/Button/Colour";
import Button from "@components/common/Button";
import EmailVerifyDialog from "@apps/settings/components/EmailVerifyDialog";
import PasswordConfirmDialog from "@apps/settings/components/PasswordConfirmDialog";

import * as styles from "./ManageAccount.module.css";

const accountStrings = "pages.settings.categories.account.manageAccount";

function ManageAccount() {
    const { t } = useTranslation();

    const [
        resetPasswordDialogOpen,
        setResetPasswordDialogOpen
    ] = useState(false);

    const [
        deleteAccountDialogOpen,
        setDeleteAccountDialogOpen
    ] = useState(false);

    async function resetPassword() {
        // stub for reset password email
    }

    async function deleteAccount(password: string) {
        // stub for delete account route
    }

    return <div className={styles.wrapper}>
        <Button
            className={styles.accountButton}
            style={{ backgroundColor: ButtonColour.BLUE }}
            onClick={() => setResetPasswordDialogOpen(true)}
        >
            {t(`${accountStrings}.resetPassword`)}
        </Button>

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

        {deleteAccountDialogOpen && <PasswordConfirmDialog
            buttonStyle={{ backgroundColor: ButtonColour.RED }}
            onClose={() => setDeleteAccountDialogOpen(false)}
            onConfirm={deleteAccount}
        >
            {t(`${accountStrings}.deleteAccountDialog`)}
        </PasswordConfirmDialog>}
    </div>;
}

export default ManageAccount;