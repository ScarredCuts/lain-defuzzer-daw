import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="title-primary">THE</span>
            <span className="title-accent">WIRED</span>
            <span className="title-secondary">DE-FUZZER</span>
          </h1>
          <p className="header-subtitle">Psychoacoustic Processor</p>
        </div>
        <div className="header-status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Ready</span>
          </div>
        </div>
      </div>
      <div className="header-divider"></div>
    </header>
  )
}
