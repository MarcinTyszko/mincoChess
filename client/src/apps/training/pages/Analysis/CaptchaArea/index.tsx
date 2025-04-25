import { useEffect } from "react";

import { useAltcha } from "@hooks/useAltcha";

function CaptchaArea() {
    const executeCaptcha = useAltcha();
    
    useEffect(() => {
        executeCaptcha();
    }, []);

    return null;
}

export default CaptchaArea;