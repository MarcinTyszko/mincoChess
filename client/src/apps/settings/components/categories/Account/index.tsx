import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import useAccountProfile from "@hooks/api/useAccountProfile";
import Separator from "@components/common/Separator";

import EditProfile from "./EditProfile";
import ManageAccount from "./ManageAccount";
import * as categoryStyles from "../Category.module.css";

function Account() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { status } = useAccountProfile();

    useEffect(() => {
        if (status == "error") navigate("/settings");
    }, [status]);

    return <div className={categoryStyles.wrapper}>
        <b className={categoryStyles.header}>
            {t("pages.settings.categories.account.editProfile.title")}
        </b>

        <Separator className={categoryStyles.separator} />

        <EditProfile/>

        <b className={categoryStyles.header}>
            {t("pages.settings.categories.account.manageAccount.title")}
        </b>

        <Separator className={categoryStyles.separator} />

        <ManageAccount/>
    </div>;
}

export default Account;