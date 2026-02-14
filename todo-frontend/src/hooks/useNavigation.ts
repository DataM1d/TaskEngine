import { useState, useCallback } from 'react';
import { FilterType } from '../types/todo';
import { useTodoContext } from '../context/TodoContext';

export const useNavigation = () => {
    const { activeFilter, setActiveFilter } = useTodoContext();
    const [focusedNoteId, setFocusedNoteId] = useState<string | null>(null);

    const handleNavigate = useCallback((filter: FilterType, noteId?: string) => {
        setActiveFilter(filter);
        setFocusedNoteId(noteId || null);
    }, [setActiveFilter]);
    
    return {
        activeFilter,
        focusedNoteId,
        handleNavigate,
    }
}