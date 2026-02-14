import Icon from '../../utils/Icon';
import { detectIconFromName } from '../../utils/iconDetector';
import './EmptyNoteState.css';

export default function EmptyNoteState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={detectIconFromName('notes')} size={48} />
      </div>
      <p className="default-text">Select a note from the sidebar to begin</p>
    </div>
  );
}