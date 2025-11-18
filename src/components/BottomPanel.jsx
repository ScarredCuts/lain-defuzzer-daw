import { useRef, useState } from 'react'
import './BottomPanel.css'

export default function BottomPanel({ isProcessing, onToggleProcessing, audioState }) {
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState('Default Sample')

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
      // File loading will be handled by parent component
      if (onToggleProcessing && typeof onToggleProcessing === 'function') {
        // We'll need to pass this up to the parent for actual file loading
        console.log('File selected:', file.name)
      }
    }
  }

  const handleLoadClick = () => {
    fileInputRef.current?.click()
  }

  const getPlayButtonText = () => {
    if (!audioState?.isLoaded) return 'START'
    return isProcessing ? 'PAUSE' : 'START'
  }

  const getPlayButtonIcon = () => {
    if (!audioState?.isLoaded) return '▶'
    return isProcessing ? '⏸' : '▶'
  }

  return (
    <footer className="bottom-panel">
      <div className="control-buttons">
        <button 
          className={`control-btn ${isProcessing ? 'active' : ''}`}
          onClick={() => onToggleProcessing()}
          disabled={!audioState?.isLoaded}
        >
          <span className="btn-icon">{getPlayButtonIcon()}</span>
          <span className="btn-text">{getPlayButtonText()}</span>
        </button>

        <button className="control-btn secondary">
          <span className="btn-icon">■</span>
          <span className="btn-text">RESET</span>
        </button>

        <button className="control-btn secondary" onClick={handleLoadClick}>
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
          <span className="info-label">FILE</span>
          <span className="info-value">{fileName}</span>
        </div>
        <div className="info-box">
          <span className="info-label">STATUS</span>
          <span className={`info-value ${audioState?.isLoaded ? 'text-accent' : 'text-secondary'}`}>
            {audioState?.isLoaded ? 'READY' : 'NO AUDIO'}
          </span>
        </div>
        <div className="info-box">
          <span className="info-label">PLAYBACK</span>
          <span className={`info-value ${audioState?.isPlaying ? 'text-accent' : 'text-secondary'}`}>
            {audioState?.isPlaying ? 'PLAYING' : 'STOPPED'}
          </span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </footer>
  )
}
