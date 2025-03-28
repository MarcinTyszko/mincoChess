import BoardState from "../BoardState";

interface SerializedStateTreeNode {
    mainline: boolean;
    state: BoardState;
    children: SerializedStateTreeNode[];
}

export default SerializedStateTreeNode;