import React from "react";

interface ColourSwatchProps {
    colour?: string;
    setColour?: React.Dispatch<React.SetStateAction<string>>;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ColourSwatchProps;