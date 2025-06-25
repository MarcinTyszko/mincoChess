import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { repeat } from "lodash-es";
import { ZodString } from "zod";

import AccountError from "shared/constants/account/Error";
import * as schemas from "shared/constants/account/schemas";
import useAccountProfile from "@hooks/api/useAccountProfile";
import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import DetailUpdateDialog from "@apps/settings/components/DetailUpdateDialog";
import EmailVerifyDialog from "@apps/settings/components/EmailVerifyDialog";

import * as styles from "./EditProfile.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

const displayNameErrors: Record<string, string> = {
    [AccountError.DISPLAY_NAME_NORMALISED]: (
        `${editProfileStrings}.displayName.errors.normalised`
    ),
    [AccountError.USERNAME_TOO_LONG]: (
        `${editProfileStrings}.displayName.errors.tooLong`
    )
};

const usernameErrors: Record<string, string> = {
    [AccountError.USERNAME_TOO_LONG]: "pages.signIn.errors.usernameTooLong",
    [AccountError.USERNAME_APLHANUMERIC]: "pages.signIn.errors.usernameAlphanumeric"
};

function getParseIssue(schema: ZodString, data: string) {
    return schema.safeParse(data).error?.issues.at(0)?.message;
}

function getNameError(
    name: string,
    schema: ZodString,
    errors: Record<string, string>
) {
    const parseIssue = getParseIssue(schema, name);

    if (!parseIssue || parseIssue == AccountError.USERNAME_TOO_SHORT) {
        return undefined;
    }

    return errors[parseIssue] || "error";
}

function EditProfile() {
    const { t } = useTranslation();

    const { profile } = useAccountProfile();

    const [ emailVisible, setEmailVisible ] = useState(false);

    const [
        displayNameDialogOpen,
        setDisplayNameDialogOpen
    ] = useState(false);
    const [ usernameDialogOpen, setUsernameDialogOpen ] = useState(false);
    const [ emailDialogOpen, setEmailDialogOpen ] = useState(false);

    async function changeDisplayName() {

    }

    async function changeUsername(password: string) {
        // stub for change username route
    }

    async function changeEmailAddress() {
        // stub for change email route
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
                {t(`${editProfileStrings}.editButton`)}
            </Button>

            {displayNameDialogOpen && <DetailUpdateDialog
                placeholder={t(`${editProfileStrings}.displayName.placeholder`)}
                onClose={() => setDisplayNameDialogOpen(false)}
                onConfirm={changeDisplayName}
                getErrorMessage={displayName => getNameError(
                    displayName, schemas.displayName, displayNameErrors
                )}
                buttonDisabled={input => input.length < 3}
            >
                {t(`${editProfileStrings}.displayName.message`)}
            </DetailUpdateDialog>}
        </div>

        <span>
            {t(`${editProfileStrings}.username`)}
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
                {t(`${editProfileStrings}.editButton`)}
            </Button>

            {usernameDialogOpen && <DetailUpdateDialog
                fields="both"
                placeholder={t("pages.signIn.username")}
                onClose={() => setUsernameDialogOpen(false)}
                onConfirm={changeUsername}
                getErrorMessage={username => getNameError(
                    username, schemas.username, usernameErrors
                )}
                buttonDisabled={input => input.length < 3}
            >
                {t(`${editProfileStrings}.usernameChange`)}    
            </DetailUpdateDialog>}
        </div>

        <span>
            {t(`${editProfileStrings}.email`)}
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
                {t(`${editProfileStrings}.editButton`)}
            </Button>

            {emailDialogOpen && <EmailVerifyDialog
                onClose={() => setEmailDialogOpen(false)}
                onSendVerification={changeEmailAddress}
            >
                {t(`${editProfileStrings}.emailVerification`)}    
            </EmailVerifyDialog>}
        </div>
    </div>;
}

export default EditProfile;