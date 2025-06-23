import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { repeat } from "lodash-es";

import useAccountProfile from "@hooks/api/useAccountProfile";
import ButtonColour from "@components/common/Button/Colour";
import Separator from "@components/common/Separator";
import TextField from "@components/common/TextField";
import Button from "@components/common/Button";

import PasswordConfirmDialog from "../../PasswordConfirmDialog";
import EmailChangeDialog from "../../EmailChangeDialog";

import * as categoryStyles from "../Category.module.css";
import * as styles from "./Account.module.css";

const editProfileStrings = "pages.settings.categories.account.editProfile";

function Account() {
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

    return <div className={categoryStyles.wrapper}>
        <b className={categoryStyles.header}>
            {t(`${editProfileStrings}.title`)}
        </b>

        <Separator className={categoryStyles.separator} />

        <div className={styles.profileDetails}>
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
                    message={t(`${editProfileStrings}.usernameChange`)}
                    onClose={() => setUsernameDialogOpen(false)}
                    onConfirm={changeUsername}
                />}
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

                {emailDialogOpen && <EmailChangeDialog onClose={
                    () => setEmailDialogOpen(false)
                }/>}
            </div>
        </div>

        <b className={categoryStyles.header}>
            {t("pages.settings.categories.account.manageAccount")}
        </b>

        <Separator className={categoryStyles.separator} />
    </div>;
}

export default Account;