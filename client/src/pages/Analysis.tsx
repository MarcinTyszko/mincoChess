import React from "react";

import { EvaluationSource } from "wintrchess";

function Analysis() {
    return <>
        <h1>WintrChess Analysis Page (Game Report)</h1>
        <p>{EvaluationSource.LOCAL}</p>
    </>;
}

export default Analysis;