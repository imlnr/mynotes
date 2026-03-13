import { useRef, useEffect, useMemo } from 'react';

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function (...args: Parameters<T>) {
        console.log(`[Debounce] Called. Setting timeout for ${wait}ms.`);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log(`[Debounce] Timeout executed.`);
            func(...args);
        }, wait);
    };
}

export function useDebounceCallback<T extends (...args: any[]) => any>(
    func: T,
    wait: number
) {
    const funcRef = useRef(func);

    useEffect(() => {
        funcRef.current = func;
    }, [func]);

    // useMemo ensures that debounce is evaluated EXACTLY ONCE upon initialization,
    // guaranteeing the closure and its `timeout` variable are never accidentally shadowed or recreated.
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

    return debouncedFunc;
}
