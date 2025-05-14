import { RefObject, useEffect } from "react";

/**
 * @description The inner width / height does not include border or scrollbar.
 * The full width / height does. If inner width != full width, you can detect
 * the existence of a scrollbar (you may have to subtract width of border * 2)
 */
function useResizeObserver<ElementType extends HTMLElement>(
    elementRef: RefObject<ElementType>,
    onResize: (size: {
        innerWidth: number;
        innerHeight: number;
        fullWidth: number;
        fullHeight: number;
    }) => void
) {
    useEffect(() => {
        if (!elementRef.current) return;

        const observer = new ResizeObserver(entries => {
            const element = entries[0].target as ElementType;

            onResize({
                innerWidth: element.clientWidth,
                innerHeight: element.clientHeight,
                fullWidth: element.offsetWidth,
                fullHeight: element.offsetHeight
            });
        });

        observer.observe(elementRef.current);

        return () => observer.disconnect();
    }, []);
}

export default useResizeObserver;