interface PasswordConfirmDialogProps {
    message: string;
    onClose: () => void;
    onConfirm: (password: string) => void;
}

export default PasswordConfirmDialogProps;