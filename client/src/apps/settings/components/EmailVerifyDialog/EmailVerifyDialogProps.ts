import { ReactNode } from "react";

interface EmailVerifyDialogProps {
    children?: ReactNode;
    onClose: () => void;
    onSendVerification: () => void | Promise<void>;
}

export default EmailVerifyDialogProps;