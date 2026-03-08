import { toast } from "sonner";

/**
 * Centralized Toast utility to handle different notification variants
 */
export const showToast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
        });
    },
    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
        });
    },
    info: (message: string, description?: string) => {
        toast(message, {
            description,
        });
    },
    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description,
        });
    },
    loading: (message: string) => {
        return toast.loading(message);
    },
    promise: <T>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return toast.promise(promise, {
            loading,
            success,
            error,
        });
    },
    dismiss: (id?: string | number) => {
        toast.dismiss(id);
    },
};
