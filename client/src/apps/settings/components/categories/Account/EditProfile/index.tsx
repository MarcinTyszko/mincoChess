import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { repeat } from "lodash-es";

import useAccountProfile from "@hooks/api/useAccountProfile";
import ButtonColour from "@components/common/Button/Colour";
import Button from "@components/common/Button";
import TextField from "@components/common/TextField";
import PasswordConfirmDialog from "@apps/settings/components/PasswordConfirmDialog";
import EmailVerifyDialog from "@apps/settings/components/EmailVerifyDialog";

import * as styles from "./EditProfile.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

function EditProfile() {
    const { t } = useTranslation();

    const { profile } = useAccountProfile();

    const [ displayName, setDisplayName ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");

    const [ emailVisible, setEmailVisible ] = useState(false);

    const [ usernameDialogOpen, setUsernameDialogOpen ] = useState(false);
    const [ emailDialogOpen, setEmailDialogOpen ] = useState(false);

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
                disabled={displayName.length == 0}
            >
                {t(`${editProfileStrings}.saveButton`)}
            </Button>
        </div>

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
                disabled={username.length < 3}
                onClick={() => setUsernameDialogOpen(true)}
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
                disabled={email.length == 0}
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