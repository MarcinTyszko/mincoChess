import React from "react";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";

function Analysis() {
    return <>
        <h1>WintrChess Analysis Page (Game Report)</h1>

        <Button 
            colour={ButtonColour.BLUE} 
            icon={require("@assets/img/kofi.svg")}
            altText="Donate"
        >
            Donate
        </Button>

        <Button 
            colour={ButtonColour.GREY} 
            icon={require("@assets/img/youtube.svg")}
            altText="YouTube"
        />

        <Button 
            colour={ButtonColour.GREY} 
            icon={require("@assets/img/discord.png")}
            altText="Discord"
        />
    </>;
}

export default Analysis;