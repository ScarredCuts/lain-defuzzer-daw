import './BottomPanel.css'

export default function BottomPanel({ isProcessing, onToggleProcessing }) {
  return (
    <footer className="bottom-panel">
      <div className="control-buttons">
        <button 
          className={`control-btn ${isProcessing ? 'active' : ''}`}
          onClick={() => onToggleProcessing(!isProcessing)}
        >
          <span className="btn-icon">{isProcessing ? '⏸' : '▶'}</span>
          <span className="btn-text">{isProcessing ? 'PAUSE' : 'START'}</span>
        </button>

        <button className="control-btn secondary">
          <span className="btn-icon">■</span>
          <span className="btn-text">RESET</span>
        </button>

        <button className="control-btn secondary">
          <span className="btn-icon">⤓</span>
          <span className="btn-text">LOAD</span>
        </button>

        <button className="control-btn secondary">
          <span className="btn-icon">⤒</span>
          <span className="btn-text">SAVE</span>
        </button>
      </div>

      <div className="status-info">
        <div className="info-box">
          <span className="info-label">CPU</span>
          <span className="info-value">12%</span>
        </div>
        <div className="info-box">
          <span className="info-label">LATENCY</span>
          <span className="info-value">4.2ms</span>
        </div>
        <div className="info-box">
          <span className="info-label">BUFFER</span>
          <span className="info-value">512</span>
        </div>
      </div>
    </footer>
  )
}
