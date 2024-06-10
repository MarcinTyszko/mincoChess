import React from "react";

import Button from "@components/common/Button";
import ButtonColour from "@constants/ButtonColour";

function Analysis() {
    return <>
        <h1>WintrChess Analysis Page (Game Report)</h1>

        <Button colour={ButtonColour.BLUE}>
            <img src="/img/kofi.svg" alt="Donate" />
            Donate
        </Button>
    </>;
}

export default Analysis;