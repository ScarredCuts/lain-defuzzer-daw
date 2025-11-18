import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import LeftPanel from './components/LeftPanel'
import MainProcessor from './components/MainProcessor'
import RightPanel from './components/RightPanel'
import BottomPanel from './components/BottomPanel'
import { useAudioEngine } from './hooks/useAudioEngine'

function App() {
  const [processingActive, setProcessingActive] = useState(false)
  const [selectedModule, setSelectedModule] = useState('defuzzer')
  const { 
    isLoaded, 
    isPlaying, 
    parameters, 
    loadDefaultSample, 
    play, 
    pause, 
    stop, 
    setParameter 
  } = useAudioEngine()

  // Load default sample when component mounts
  useEffect(() => {
    loadDefaultSample()
  }, [loadDefaultSample])

  const handleToggleProcessing = async () => {
    if (!isLoaded) {
      await loadDefaultSample()
    }
    
    if (isPlaying) {
      pause()
      setProcessingActive(false)
    } else {
      play()
      setProcessingActive(true)
    }
  }

  const handleParameterChange = (param, value) => {
    const normalizedValue = value / 100 // Convert from 0-100 to 0-1
    setParameter(param, normalizedValue)
  }

  return (
    <div className="app-container">
      <Header />
      <div className="app-main">
        <LeftPanel 
          selectedModule={selectedModule}
          onSelectModule={setSelectedModule}
        />
        <MainProcessor 
          isProcessing={processingActive}
          selectedModule={selectedModule}
          audioState={{ isLoaded, isPlaying }}
          onParameterChange={handleParameterChange}
          parameters={parameters}
        />
        <RightPanel 
          selectedModule={selectedModule}
          isProcessing={processingActive}
          onParameterChange={handleParameterChange}
          parameters={parameters}
        />
      </div>
      <BottomPanel 
        isProcessing={processingActive}
        onToggleProcessing={handleToggleProcessing}
        audioState={{ isLoaded, isPlaying }}
      />
    </div>
  )
}

export default App
