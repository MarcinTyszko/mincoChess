import { createContext } from "react";

import { StateTreeNode } from "wintrchess";

type MoveClickEventListener = (node: StateTreeNode) => void;

const MoveClickEventContext = createContext<MoveClickEventListener | undefined>(undefined);

export default MoveClickEventContext;