import { AnalysedGame, StateTreeNode } from "wintrchess";

interface ShareDialogProps {
    game: AnalysedGame;
    currentNode: StateTreeNode;
    onClose: () => void;
}

export default ShareDialogProps;