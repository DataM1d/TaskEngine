import { memo } from 'react';
import TodoHeader from './TodoHeader';
import TodoTabs from './TodoTabs';
import TrashActions from './TrashActions';
import TodoArea from './TodoArea';
import NotesWorkspace from '../notes/NotesWorkspace';
import { FilterType } from '../../types/todo';
import { useTodoContext } from '../../context/TodoContext';
import './MainContent.css';

interface MainContentProps {
  filter: FilterType;
  focusedNoteId: string | null;
  setFilter: (filter: FilterType, noteId?: string) => void;
}

const MainContent = memo(({ filter, focusedNoteId, setFilter }: MainContentProps) => {
  const { filteredTodos, stats } = useTodoContext();
  
  const isNotesView = filter === 'Notes';
  const isTrashView = filter === 'Trash';

  const currentCount = isNotesView ? stats.notes : filteredTodos.length;

  return (
    <main className="sb-dashboard-shell">
      <TodoHeader filter={filter} taskCount={currentCount} />

      <div className={`sb-container ${isNotesView ? 'is-notes-view' : ''}`}>
        {isNotesView ? (
          <NotesWorkspace 
            focusedNoteId={focusedNoteId}
            setFilter={setFilter}
          />
        ) : (
          <>
            <div className="sb-workspace-static">
              <div className="tabs-header-row">
                <TodoTabs activeFilter={filter} setFilter={setFilter} />
                {isTrashView && <TrashActions />}
              </div>
            </div>


            <TodoArea 
              filter={filter} 
              isTrashView={isTrashView} 
              setFilter={setFilter} 
            />
          </>
        )}
      </div>
    </main>
  );
});

MainContent.displayName = 'MainContent';
export default MainContent;