import BoardState from "./BoardState";

interface StateTreeNode {
    mainline: boolean;
    state: BoardState;
    children: StateTreeNode[];
    parent: StateTreeNode;
}

export default StateTreeNode;