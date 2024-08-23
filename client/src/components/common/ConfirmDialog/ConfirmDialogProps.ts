interface ConfirmDialogProps {
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    dangerAction?: boolean;
    onConfirm: () => void;
}

export default ConfirmDialogProps;