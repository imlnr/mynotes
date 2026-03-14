import { useRef, useEffect, useMemo } from 'react';

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (...args: Parameters<T>) {
        console.log(`[Debounce] Called. Setting timeout for ${wait}ms.`);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log(`[Debounce] Timeout executed.`);
            func(...args);
        }, wait);
    };

    debounced.cancel = () => {
        if (timeout) {
            console.log("[Debounce] Cancelled.");
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}

export function useDebounceCallback<T extends (...args: any[]) => any>(
    func: T,
    wait: number
) {
    const funcRef = useRef(func);

    useEffect(() => {
        funcRef.current = func;
    }, [func]);

    const debouncedFunc = useMemo(
        () => debounce((...args: Parameters<T>) => {
            console.log("[useDebounceCallback] Executing wrapped function...");
            if (funcRef.current) {
                funcRef.current(...args);
            } else {
                console.warn("[useDebounceCallback] funcRef is missing!");
            }
        }, wait),
        [wait]
    );

    useEffect(() => {
        return () => {
            debouncedFunc.cancel();
        };
    }, [debouncedFunc]);

    return debouncedFunc;
}
