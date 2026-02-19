import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

const ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
};

let toastIdCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            if (timersRef.current[id]) {
                clearTimeout(timersRef.current[id]);
                delete timersRef.current[id];
            }
        }, 300);
    }, []);

    const addToast = useCallback((message, variant = 'info', duration = 3500, title) => {
        const id = ++toastIdCounter;
        const autoTitle = title || (variant === 'success' ? 'Success' : variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Info');
        setToasts((prev) => [...prev, { id, message, variant, title: autoTitle, duration, exiting: false }]);
        timersRef.current[id] = setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    const toast = useCallback({
        success: (msg, title) => addToast(msg, 'success', 3500, title),
        error: (msg, title) => addToast(msg, 'error', 5000, title),
        warning: (msg, title) => addToast(msg, 'warning', 4000, title),
        info: (msg, title) => addToast(msg, 'info', 3500, title),
    }, [addToast]);

    // Fix: useCallback can't wrap a plain object. Let's use useMemo-like approach
    // Actually, let's just define toast as methods directly.

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast-${t.variant} ${t.exiting ? 'exiting' : ''}`}>
                        <div className="toast-icon">{ICONS[t.variant]}</div>
                        <div className="toast-content">
                            <div className="toast-title">{t.title}</div>
                            <div className="toast-message">{t.message}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(t.id)}>
                            <X size={16} />
                        </button>
                        <div className="toast-progress" style={{ animationDuration: `${t.duration}ms` }} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    const { addToast } = context;
    return {
        success: (msg, title) => addToast(msg, 'success', 3500, title),
        error: (msg, title) => addToast(msg, 'error', 5000, title),
        warning: (msg, title) => addToast(msg, 'warning', 4000, title),
        info: (msg, title) => addToast(msg, 'info', 3500, title),
    };
}
