import { useState, useCallback, useEffect, useMemo } from 'react';

const CONFIG = { MIN: 220, MAX: 320, COLLAPSE: 100, DEFAULT: 220 };

export function useSidebar() {
    const [width, setWidth] = useState(CONFIG.DEFAULT);
    const isHidden = useMemo(() => width === 0, [width]);

    const toggle = useCallback(() => {
        setWidth(prev => (prev === 0 ? CONFIG.DEFAULT : 0));
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const newWidth = e.clientX;
        if (newWidth < CONFIG.COLLAPSE) setWidth(0);
        else if (newWidth >= CONFIG.MIN && newWidth <= CONFIG.MAX) setWidth(newWidth);
    }, []);

    const stopResizing = useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.classList.remove('is-resizing');
    }, [handleMouseMove]);

    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.classList.add('is-resizing');
    }, [handleMouseMove, stopResizing]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                toggle();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    return { width, isHidden, toggle, startResizing };
}
