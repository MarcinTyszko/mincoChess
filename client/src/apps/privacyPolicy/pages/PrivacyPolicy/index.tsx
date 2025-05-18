import React from "react";

import Separator from "@components/common/Separator";

import * as styles from "./PrivacyPolicy.module.css";

function PrivacyPolicy() {
    return <div className={styles.wrapper}>
        <div className={styles.content}>
            <h1 className={styles.title}>
                <img
                    src={require("@assets/img/logo.svg")}
                    height={45}
                    draggable={false}
                />

                Privacy Policy
            </h1>

            <Separator/>

            <h3 style={{ margin: 0 }}>
                Glossary
            </h3>

            <span>
                "The Service", "The Website", "We", "Our", "Us" - the wintrchess.com website
                and any service that we provide that you use therein.
                Also the entity that collects information from you.
            </span>

            <span>
                "The User" - The entity from whom we are collecting and or processing information.
            </span>

            <h3 style={{ margin: 0 }}>
                Data we collect
            </h3>

            <span>
                IP Addresses are collected to establish a connection between
                the User and the Website, and to uphold security practices. The website is
                protected by Cloudflare; you can find the data they collect in their{" "}

                <a href="https://www.cloudflare.com/en-gb/privacypolicy/">
                    Privacy Policy
                </a>

                .
            </span>

            <span>
                We use cookies to store a session token string. This keeps you from
                needing to solve a CAPTCHA to access Chess game analysis and move
                classifications, but doesn't contain any personal information.
                It is highly recommended to keep cookies on; you may otherwise lose
                functionality. The CAPTCHA is proof-of-work based; it does not collect
                any personal data.
            </span>

            <span>
                In short, we collect information that you explicitly provide to us. Any
                information included in Chess games you review and PGN files you upload
                is collected and sometimes retained. This may include:
            </span>

            <span>
                Chess.com usernames and profile images
                <br/>
                Lichess.org usernames and profile images
            </span>

            <span>
                Usernames for Chess services like Chess.com or Lichess will be collected
                by those respective services when you search for games on your account.
            </span>

            <h3 style={{ margin: 0 }}>
                Children's Privacy
            </h3>

            <span>
                We do not knowingly collect personal information from persons under the
                age of 13. If you think that we have done so, please contact us.
            </span>

            <h3 style={{ margin: 0 }}>
                Your Data Rights
            </h3>

            <span>
                In accordance with the GDPR, you have the right to:
            </span>

            <span>
                Request for a copy of the personal information we hold about you.
            </span>

            <span>
                Request for the personal information we hold about you to be erased.
                This will delete your account if you have one on the Website.
            </span>

            <span>
                Be responded to within 30 days, or be given notice in advance if this
                cannot be met.
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
                contact@wintrchess.com
            </b>
        </div>
    </div>;
}

export default PrivacyPolicy;