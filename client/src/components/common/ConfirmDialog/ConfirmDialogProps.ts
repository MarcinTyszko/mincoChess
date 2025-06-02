interface ConfirmDialogProps {
    children: React.ReactNode;
    dangerAction?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default ConfirmDialogProps;