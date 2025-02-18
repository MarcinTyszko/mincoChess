import {
    useState,
    useEffect,
    useRef,
    MouseEvent
} from "react";
import { uniqueId } from "lodash";

import { ContextMenuPosition } from "@components/common/ContextMenu/types";
import useContextMenuStore from "@stores/ContextMenuStore";

function useContextMenu() {
    const { openId, setOpenId } = useContextMenuStore();

    const contextMenuIdRef = useRef(uniqueId());

    const [
        contextMenuPosition,
        setContextMenuPosition
    ] = useState<ContextMenuPosition>();

    function onClick() {
        setContextMenuPosition(undefined);
        removeEventListener("click", onClick);
    }

    useEffect(() => {
        if (openId == contextMenuIdRef.current) return;

        onClick();
    }, [openId]);

    return {
        contextMenuPosition: contextMenuPosition,
        openContextMenu: (event: MouseEvent) => {
            event.preventDefault();

            setOpenId(contextMenuIdRef.current);
    
            setContextMenuPosition({
                x: event.pageX,
                y: event.pageY
            });
    
            addEventListener("click", onClick);
        }
    };
}

export default useContextMenu;