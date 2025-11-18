import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import LeftPanel from './components/LeftPanel'
import MainProcessor from './components/MainProcessor'
import RightPanel from './components/RightPanel'
import BottomPanel from './components/BottomPanel'

function App() {
  const [processingActive, setProcessingActive] = useState(false)
  const [selectedModule, setSelectedModule] = useState('defuzzer')

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
        />
        <RightPanel 
          selectedModule={selectedModule}
          isProcessing={processingActive}
        />
      </div>
      <BottomPanel 
        isProcessing={processingActive}
        onToggleProcessing={setProcessingActive}
      />
    </div>
  )
}

export default App
