/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/refs */
import { useRef, useEffect, useMemo } from 'react';

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };

    debounced.cancel = () => {
        if (timeout) {
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
            funcRef.current(...args);
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
