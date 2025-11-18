import { useState, useEffect } from 'react'
import './MainProcessor.css'
import Visualizer from './Visualizer'

export default function MainProcessor({ isProcessing, selectedModule, audioState, onParameterChange, parameters }) {
  const [inputLevel, setInputLevel] = useState(50)
  const [outputLevel, setOutputLevel] = useState(50)

  // Update local state when audio parameters change
  useEffect(() => {
    if (parameters.inputLevel !== undefined) {
      setInputLevel(Math.round(parameters.inputLevel * 100))
    }
    if (parameters.outputLevel !== undefined) {
      setOutputLevel(Math.round(parameters.outputLevel * 100))
    }
  }, [parameters])

  const handleInputChange = (value) => {
    setInputLevel(value)
    if (onParameterChange) {
      onParameterChange('inputLevel', value)
    }
  }

  const handleOutputChange = (value) => {
    setOutputLevel(value)
    if (onParameterChange) {
      onParameterChange('outputLevel', value)
    }
  }

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

  const getStatusText = () => {
    if (!audioState?.isLoaded) return 'NO AUDIO LOADED'
    if (audioState?.isPlaying) return 'PROCESSING'
    return 'READY'
  }

  const getStatusClass = () => {
    if (!audioState?.isLoaded) return 'inactive'
    if (audioState?.isPlaying) return 'active'
    return 'ready'
  }

  return (
    <main className="main-processor">
      <div className="processor-header">
        <h2>{getModuleTitle()}</h2>
        <div className="processor-status">
          <span className={`status-badge ${getStatusClass()}`}>
            {getStatusText()}
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
                onChange={(e) => handleInputChange(e.target.value)}
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
                onChange={(e) => handleOutputChange(e.target.value)}
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
            {getStatusText()}
          </span>
        </div>
        <div className="info-line">
          <span>Audio:</span>
          <span className={audioState?.isLoaded ? 'text-accent' : 'text-secondary'}>
            {audioState?.isLoaded ? 'LOADED' : 'NONE'}
          </span>
        </div>
      </div>
    </main>
  )
}
