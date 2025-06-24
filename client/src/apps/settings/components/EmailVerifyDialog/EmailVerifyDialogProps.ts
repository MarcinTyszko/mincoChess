import { Dispatch, ReactNode, SetStateAction } from "react";

import VerifyState from "./VerifyState";

interface EmailVerifyDialogProps {
    children?: ReactNode;
    onClose: () => void;
    onSendVerification: (
        setStatus: Dispatch<SetStateAction<VerifyState>>,
        setError: Dispatch<SetStateAction<string | undefined>>
    ) => void;
}

export default EmailVerifyDialogProps;