import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { repeat } from "lodash-es";
import { ZodString } from "zod";

import AccountError from "shared/constants/account/Error";
import * as schemas from "shared/constants/account/schemas";
import useAccountProfile from "@hooks/api/useAccountProfile";
import ButtonColour from "@components/common/Button/Colour";
import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import LogMessage from "@components/common/LogMessage";
import PasswordConfirmDialog from "@apps/settings/components/PasswordConfirmDialog";
import EmailVerifyDialog from "@apps/settings/components/EmailVerifyDialog";

import * as styles from "./EditProfile.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

const displayNameErrors: Record<string, string> = {
    [AccountError.DISPLAY_NAME_NORMALISED]: (
        `${editProfileStrings}.displayNameErrors.normalised`
    ),
    [AccountError.USERNAME_TOO_LONG]: (
        `${editProfileStrings}.displayNameErrors.tooLong`
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

    const [ displayName, setDisplayName ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");

    const [ emailVisible, setEmailVisible ] = useState(false);

    const [ usernameDialogOpen, setUsernameDialogOpen ] = useState(false);
    const [ emailDialogOpen, setEmailDialogOpen ] = useState(false);

    const displayNameError = useMemo(() => (
        getNameError(displayName, schemas.displayName, displayNameErrors)
    ), [displayName]);

    const usernameError = useMemo(() => (
        getNameError(username, schemas.username, usernameErrors)
    ), [username]);

    async function changeUsername() {
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
            {t(`${editProfileStrings}.displayName`)}
        </span>

        <div className={styles.detailSetting}>
            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={styles.detailField}
                placeholder={profile?.displayName}
                value={displayName}
                onChange={setDisplayName}
            />

            <Button
                className={styles.detailFieldButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                disabled={!!displayNameError || displayName.length < 3}
            >
                {t(`${editProfileStrings}.saveButton`)}
            </Button>
        </div>

        {displayNameError && <LogMessage>
            {t(displayNameError)}
        </LogMessage>}

        <span>
            {t(`${editProfileStrings}.username`)}
        </span>

        <div className={styles.detailSetting}>
            <TextField
                wrapperClassName={styles.detailFieldWrapper}
                className={styles.detailField}
                placeholder={profile?.username}
                value={username}
                onChange={setUsername}
            />

            <Button
                className={styles.detailFieldButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                disabled={!!usernameError || username.length < 3}
                onClick={() => {
                    if (usernameError) return;
                    setUsernameDialogOpen(true);
                }}
            >
                {t(`${editProfileStrings}.saveButton`)}
            </Button>

            {usernameDialogOpen && <PasswordConfirmDialog
                onClose={() => setUsernameDialogOpen(false)}
                onConfirm={changeUsername}
            >
                {t(`${editProfileStrings}.usernameChange`)}    
            </PasswordConfirmDialog>}
        </div>

        {usernameError && <LogMessage>
            {t(usernameError)}
        </LogMessage>}

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
                placeholder={emailVisible
                    ? profile?.email
                    : repeat("*", profile?.email.length || 0)
                }
                value={email}
                onChange={setEmail}
            />

            <Button
                className={styles.detailFieldButton}
                style={{ backgroundColor: ButtonColour.BLUE }}
                disabled={(
                    !schemas.email.safeParse(email).success
                    || email.length == 0
                )}
                onClick={() => setEmailDialogOpen(true)}
            >
                {t(`${editProfileStrings}.saveButton`)}
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