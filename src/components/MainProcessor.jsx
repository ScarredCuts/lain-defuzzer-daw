import { useState } from 'react'
import './MainProcessor.css'
import Visualizer from './Visualizer'

export default function MainProcessor({ isProcessing, selectedModule }) {
  const [inputLevel, setInputLevel] = useState(50)
  const [outputLevel, setOutputLevel] = useState(50)

  const getModuleTitle = () => {
    const modules = {
      defuzzer: 'Psychoacoustic Defuzzer',
      harmonic: 'Harmonic Processor',
      presence: 'Presence Enhancement',
      dynamics: 'Dynamics Processor',
      spatial: 'Spatial Processor',
    }
    return modules[selectedModule] || 'Audio Processor'
  }

  return (
    <main className="main-processor">
      <div className="processor-header">
        <h2>{getModuleTitle()}</h2>
        <div className="processor-status">
          <span className={`status-badge ${isProcessing ? 'active' : 'inactive'}`}>
            {isProcessing ? '● PROCESSING' : '○ IDLE'}
          </span>
        </div>
      </div>

      <div className="processor-content">
        <Visualizer isProcessing={isProcessing} />

        <div className="processor-controls">
          <div className="control-group">
            <label htmlFor="input-level">Input Level</label>
            <div className="level-container">
              <input
                id="input-level"
                type="range"
                min="0"
                max="100"
                value={inputLevel}
                onChange={(e) => setInputLevel(e.target.value)}
                className="slider"
              />
              <span className="level-value">{inputLevel}%</span>
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="output-level">Output Level</label>
            <div className="level-container">
              <input
                id="output-level"
                type="range"
                min="0"
                max="100"
                value={outputLevel}
                onChange={(e) => setOutputLevel(e.target.value)}
                className="slider"
              />
              <span className="level-value">{outputLevel}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="processor-footer">
        <div className="info-line">
          <span>Module:</span>
          <span className="text-accent">{selectedModule.toUpperCase()}</span>
        </div>
        <div className="info-line">
          <span>Signal:</span>
          <span className={isProcessing ? 'text-accent' : 'text-secondary'}>
            {isProcessing ? 'PROCESSING' : 'IDLE'}
          </span>
        </div>
      </div>
    </main>
  )
}
