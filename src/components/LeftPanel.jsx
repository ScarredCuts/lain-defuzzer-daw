import './LeftPanel.css'

const modules = [
  {
    id: 'defuzzer',
    name: 'Defuzzer',
    description: 'Primary artifact removal',
    icon: '◇',
  },
  {
    id: 'harmonic',
    name: 'Harmonic',
    description: 'Frequency balancing',
    icon: '≈',
  },
  {
    id: 'presence',
    name: 'Presence',
    description: 'Analog warmth',
    icon: '⊕',
  },
  {
    id: 'dynamics',
    name: 'Dynamics',
    description: 'Transient control',
    icon: '⊡',
  },
  {
    id: 'spatial',
    name: 'Spatial',
    description: 'Stereo processing',
    icon: '◈',
  },
]

export default function LeftPanel({ selectedModule, onSelectModule }) {
  return (
    <aside className="left-panel">
      <div className="panel-header">
        <h3>Modules</h3>
      </div>
      <div className="modules-list">
        {modules.map((module) => (
          <button
            key={module.id}
            className={`module-button ${selectedModule === module.id ? 'active' : ''}`}
            onClick={() => onSelectModule(module.id)}
          >
            <span className="module-icon">{module.icon}</span>
            <div className="module-info">
              <div className="module-name">{module.name}</div>
              <div className="module-description">{module.description}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="panel-footer">
        <div className="footer-item">
          <span className="footer-label">V</span>
          <span className="footer-value">1.0.0</span>
        </div>
      </div>
    </aside>
  )
}
