import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { repeat } from "lodash-es";
import { ZodSchema } from "zod";

import schemas from "shared/constants/account/schemas";
import accountErrors from "shared/constants/account/errors";
import { validate } from "shared/lib/utils/validate";
import useAccountProfile from "@/hooks/api/useAccountProfile";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import authClient from "@/lib/auth";

import { editProfileStrings } from "@/apps/settings/constants/utils";
import DetailUpdateDialog from "@/apps/settings/components/DetailUpdateDialog";
import EmailChangeDialog from "@/apps/settings/components/EmailChangeDialog";

import * as settingsStyles from "@/apps/settings/index.module.css";
import * as styles from "./EditProfile.module.css";

import iconInterfaceEdit from "@assets/img/interface/edit.svg";
import iconInterfaceVisibleenabled from "@assets/img/interface/visibleenabled.svg";
import iconInterfaceVisibledisabled from "@assets/img/interface/visibledisabled.svg";

function EditProfile() {
    const { t } = useTranslation(["common", "settings"]);

    const { profile, refetch } = useAccountProfile();

    const getErrorMessage = useAuthErrors();

    const [ emailVisible, setEmailVisible ] = useState(false);

    const [
        displayNameDialogOpen,
        setDisplayNameDialogOpen
    ] = useState(false);
    const [ usernameDialogOpen, setUsernameDialogOpen ] = useState(false);
    const [ emailDialogOpen, setEmailDialogOpen ] = useState(false);

    function validateDetail(input: string, schema: ZodSchema) {
        const error = validate(input, schema);

        if (
            !error
            || error == accountErrors.DISPLAY_NAME_TOO_SHORT.code
            || error == accountErrors.USERNAME_TOO_SHORT.code
        ) return;

        return getErrorMessage(error);
    }

    async function updateDisplayName(displayName: string) {
        await authClient.updateUser({ name: displayName });
        refetch();
    }

    async function updateUsername(username: string) {
        await fetch("/auth/change-username", {
            method: "POST",
            body: username
        });

        refetch();
    }

    return <div className={styles.wrapper}>
        <div className={styles.profileAvatar}>
            <Button
                className={styles.editAvatarButton}
                icon={iconInterfaceEdit}
            />
        </div>

        <span>
            {t("account.fields.displayName")}
        </span>

        <div className={styles.detailSetting}>
            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={settingsStyles.inputField}
                value={profile?.displayName}
                readOnly
            />

            <Button
                className={styles.detailFieldButton}
                onClick={() => setDisplayNameDialogOpen(true)}
            >
                {t("edit")}
            </Button>

            {displayNameDialogOpen && <DetailUpdateDialog
                placeholder={t("account.placeholders.displayName")}
                onClose={() => setDisplayNameDialogOpen(false)}
                onConfirm={updateDisplayName}
                getErrorMessage={input => validateDetail(
                    input, schemas.displayName
                )}
                buttonDisabled={input => input.length < 3}
            >
                {t(`${editProfileStrings}.displayName.message`, { ns: "settings" })}
            </DetailUpdateDialog>}
        </div>

        <span>
            {t("account.fields.username")}
        </span>

        <div className={styles.detailSetting}>
            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={settingsStyles.inputField}
                value={profile?.username}
                readOnly
            />

            <Button
                className={styles.detailFieldButton}
                onClick={() => setUsernameDialogOpen(true)}
            >
                {t("edit")}
            </Button>

            {usernameDialogOpen && <DetailUpdateDialog
                placeholder={t("account.placeholders.username")}
                onClose={() => setUsernameDialogOpen(false)}
                onConfirm={updateUsername}
                getErrorMessage={input => validateDetail(
                    input, schemas.username
                )}
                buttonDisabled={input => input.length < 3}
            >
                {t(`${editProfileStrings}.username.message`, { ns: "settings" })}
            </DetailUpdateDialog>}
        </div>

        <span>
            {t("account.fields.email")}
        </span>

        <div className={styles.detailSetting}>
            <Button
                className={styles.detailFieldButton}
                icon={emailVisible
                    ? iconInterfaceVisibleenabled
                    : iconInterfaceVisibledisabled
                }
                onClick={() => setEmailVisible(!emailVisible)}
            />

            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={settingsStyles.inputField}
                value={emailVisible
                    ? profile?.email
                    : repeat("*", profile?.email.length || 0)
                }
                readOnly
            />

            <Button
                className={styles.detailFieldButton}
                onClick={() => setEmailDialogOpen(true)}
            >
                {t("edit")}
            </Button>

            {emailDialogOpen && <EmailChangeDialog
                onClose={() => setEmailDialogOpen(false)}
            />}
        </div>
    </div>;
}

export default EditProfile;