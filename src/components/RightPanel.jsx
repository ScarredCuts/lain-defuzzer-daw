import { useState, useEffect } from 'react'
import './RightPanel.css'

const parameterSets = {
  defuzzer: [
    { id: 'intensity', label: 'Intensity', value: 65, min: 0, max: 100 },
    { id: 'threshold', label: 'Threshold', value: 45, min: 0, max: 100 },
    { id: 'presence', label: 'Presence', value: 55, min: 0, max: 100 },
  ],
  harmonic: [
    { id: 'bass', label: 'Bass', value: 50, min: 0, max: 100 },
    { id: 'midrange', label: 'Midrange', value: 60, min: 0, max: 100 },
    { id: 'treble', label: 'Treble', value: 55, min: 0, max: 100 },
  ],
  presence: [
    { id: 'warmth', label: 'Warmth', value: 70, min: 0, max: 100 },
    { id: 'presence', label: 'Presence', value: 60, min: 0, max: 100 },
    { id: 'bloom', label: 'Bloom', value: 50, min: 0, max: 100 },
  ],
  dynamics: [
    { id: 'attack', label: 'Attack', value: 40, min: 0, max: 100 },
    { id: 'release', label: 'Release', value: 60, min: 0, max: 100 },
    { id: 'ratio', label: 'Ratio', value: 50, min: 0, max: 100 },
  ],
  spatial: [
    { id: 'width', label: 'Width', value: 50, min: 0, max: 100 },
    { id: 'depth', label: 'Depth', value: 55, min: 0, max: 100 },
    { id: 'imaging', label: 'Imaging', value: 60, min: 0, max: 100 },
  ],
}

export default function RightPanel({ selectedModule, isProcessing, onParameterChange, parameters }) {
  const params = parameterSets[selectedModule] || []
  const [values, setValues] = useState(
    params.reduce((acc, param) => ({ ...acc, [param.id]: param.value }), {})
  )

  // Update local values when audio parameters change
  useEffect(() => {
    const updatedValues = {}
    params.forEach((param) => {
      if (parameters[param.id] !== undefined) {
        updatedValues[param.id] = Math.round(parameters[param.id] * 100)
      } else {
        updatedValues[param.id] = param.value
      }
    })
    setValues(updatedValues)
  }, [parameters, params])

  const handleChange = (id, value) => {
    const newValue = parseFloat(value)
    setValues({ ...values, [id]: newValue })
    
    if (onParameterChange) {
      onParameterChange(id, newValue)
    }
  }

  return (
    <aside className="right-panel">
      <div className="panel-header">
        <h3>Parameters</h3>
      </div>

      <div className="parameters-list">
        {params.map((param) => (
          <div key={param.id} className="parameter-item">
            <div className="param-header">
              <label htmlFor={`param-${param.id}`}>{param.label}</label>
              <span className="param-value">{Math.round(values[param.id])}</span>
            </div>
            <div className="param-slider-container">
              <input
                id={`param-${param.id}`}
                type="range"
                min={param.min}
                max={param.max}
                value={values[param.id]}
                onChange={(e) => handleChange(param.id, e.target.value)}
                className="param-slider"
                disabled={!isProcessing}
              />
              <div className="param-value-bar" style={{
                width: `${(values[param.id] / param.max) * 100}%`,
              }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <div className="preset-buttons">
          <button className="preset-btn">Default</button>
          <button className="preset-btn">Aggressive</button>
        </div>
      </div>
    </aside>
  )
}
