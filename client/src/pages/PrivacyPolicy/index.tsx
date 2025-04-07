import React from "react";

import * as styles from "./PrivacyPolicy.module.css";

function PrivacyPolicy() {
    return <div className={styles.wrapper}>
        <div className={styles.messageContent}>
            <img
                src={require("@assets/img/logo.svg")}
                height={70}
                draggable={false}
            />

            <h1 style={{ margin: 0 }}>
                Privacy Policy
            </h1>

            <span>
                A full privacy policy will be written upon full release of the website.
            </span>

            <h3 style={{ margin: 0 }}>
                Glossary
            </h3>

            <span>
                The "Service" / the "Website" - the www.wintrchess.com website
                and any service or tool that we provide that you use therein.
                Also the entity that collects information from you.
            </span>

            <span>
                The "User" / the "Data Subject" - you, when using the Service and
                the entity from whom we collect information.
            </span>

            <h3 style={{ margin: 0 }}>
                Data we collect
            </h3>

            <span>
                IP Addresses are collected to establish a connection between
                the User and the Website. They are also used to uphold security,
                and to collect analytics that help improve the Service.
            </span>

            <span>
                We use cookies to store a session token string. This keeps you from
                needing to solve a CAPTCHA to access Chess game analysis and move
                classifications. It is highly recommended to keep cookies on;
                you may otherwise lose functionality.
            </span>

            <span>
                In short, information that you explicitly provide to us. Any information
                included in PGN files you upload is collected. This may include:
            </span>

            <span>
                Chess.com usernames and profile images
                <br/>
                Lichess.org usernames and profile images
            </span>

            <h3 style={{ margin: 0 }}>
                Children's Privacy
            </h3>

            <span>
                We do not knowingly collect information from persons under the age of 13.
                If you think that we have done so, please contact us.
            </span>

            <h3 style={{ margin: 0 }}>
                Revisions
            </h3>

            <span>
                Changes to this privacy policy will be announced on the website page.
            </span>

            <h3 style={{ margin: 0 }}>
                Contact Us
            </h3>

            <span>
                If you have questions regarding this policy, you can contact us at:
            </span>

            <b>
                support@wintrchess.com
            </b>
        </div>
    </div>;
}

export default PrivacyPolicy;