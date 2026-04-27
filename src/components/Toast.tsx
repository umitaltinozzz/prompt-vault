'use client';

import { useState, useCallback } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
}

export function useToast() {
    const [toast, setToast] = useState<ToastProps | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, hideToast };
}

export function Toast({ toast }: { toast: ToastProps | null }) {
    if (!toast) return null;

    return (
        <div className={`toast toast-${toast.type}`}>
            {toast.message}
        </div>
    );
}
