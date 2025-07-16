import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { repeat } from "lodash-es";
import { ZodString } from "zod";

import schemas from "shared/constants/account/schemas";
import useAccountProfile from "@/hooks/api/useAccountProfile";
import useAuthErrors from "@/hooks/auth/useAuthErrors";
import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import DetailUpdateDialog from "@/apps/settings/components/DetailUpdateDialog";
import EmailVerifyDialog from "@/apps/settings/components/EmailVerifyDialog";

import * as styles from "./EditProfile.module.css";

type AccountField = "displayName" | "username" | "email";

const editProfileStrings = "pages.settings.categories.account.editProfile";

function EditProfile() {
    const { t } = useTranslation();

    const { profile } = useAccountProfile();
    const getErrorMessage = useAuthErrors();

    const [ emailVisible, setEmailVisible ] = useState(false);

    const [
        displayNameDialogOpen,
        setDisplayNameDialogOpen
    ] = useState(false);
    const [ usernameDialogOpen, setUsernameDialogOpen ] = useState(false);
    const [ emailDialogOpen, setEmailDialogOpen ] = useState(false);

    function validateDetail(schema: ZodString, input: string) {
        const validation = schema.safeParse(input);
        if (validation.success) return;

        return getErrorMessage(validation.error.issues.at(0)?.message);
    }

    function updateAccount(field: AccountField, input?: string) {
        // update account stuff
        switch (field) {
            case "displayName":
                return;
        }
    }

    return <div className={styles.wrapper}>
        <div className={styles.profileAvatar}>
            <Button
                className={styles.editAvatarButton}
                icon={require("@assets/img/interface/edit.svg")}
            />
        </div>

        <span>
            {t(`${editProfileStrings}.displayName.title`)}
        </span>

        <div className={styles.detailSetting}>
            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={styles.detailField}
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
                placeholder={t(`${editProfileStrings}.displayName.placeholder`)}
                onClose={() => setDisplayNameDialogOpen(false)}
                onConfirm={input => updateAccount("displayName", input)}
                getErrorMessage={input => validateDetail(
                    schemas.displayName, input
                )}
                buttonDisabled={input => input.length < 3}
            >
                {t(`${editProfileStrings}.displayName.message`)}
            </DetailUpdateDialog>}
        </div>

        <span>
            {t(`${editProfileStrings}.username.title`)}
        </span>

        <div className={styles.detailSetting}>
            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={styles.detailField}
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
                placeholder={t("pages.signIn.username")}
                onClose={() => setUsernameDialogOpen(false)}
                onConfirm={input => updateAccount("username", input)}
                getErrorMessage={input => validateDetail(
                    schemas.username, input
                )}
                buttonDisabled={input => input.length < 3}
            >
                {t(`${editProfileStrings}.username.message`)}
            </DetailUpdateDialog>}
        </div>

        <span>
            {t(`${editProfileStrings}.email.title`)}
        </span>

        <div className={styles.detailSetting}>
            <Button
                className={styles.detailFieldButton}
                icon={emailVisible
                    ? require("@assets/img/interface/visibleenabled.svg")
                    : require("@assets/img/interface/visibledisabled.svg")
                }
                onClick={() => setEmailVisible(!emailVisible)}
            />

            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={styles.detailField}
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

            {emailDialogOpen && <EmailVerifyDialog
                onClose={() => setEmailDialogOpen(false)}
                onSendVerification={() => updateAccount("email")}
            >
                {t(`${editProfileStrings}.email.verification`)}    
            </EmailVerifyDialog>}
        </div>
    </div>;
}

export default EditProfile;