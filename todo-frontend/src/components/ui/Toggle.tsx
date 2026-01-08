import '../../components/Sidebar/Sidebar.css';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function Toggle({ isOn, onToggle }: ToggleProps) {
  return (
    <div 
      className={`toggle-switch ${isOn ? 'on' : ''}`} 
      onClick={onToggle}
      role="switch"
      aria-checked={isOn}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onToggle();
        }
      }}
    >
      <div className="toggle-knob"></div>
    </div>
  );
}