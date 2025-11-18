import { useEffect, useRef } from 'react'
import './Visualizer.css'

export default function Visualizer({ isProcessing }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const analyserRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    // Set canvas size
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    ctx.scale(dpr, dpr)

    const width = canvas.clientWidth
    const height = canvas.clientHeight

    let phase = 0

    const drawVisualizer = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)'
      ctx.lineWidth = 1
      const gridSize = 40

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw waveform
      if (isProcessing) {
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.8)'
        ctx.lineWidth = 2
        ctx.beginPath()

        const frequency = 0.02
        const amplitude = height * 0.3

        for (let x = 0; x < width; x++) {
          // Simulate processed audio with more complex waveform
          const sine = Math.sin((x * frequency) + phase)
          const harmonic1 = Math.sin((x * frequency * 2) + phase * 1.5) * 0.3
          const harmonic2 = Math.sin((x * frequency * 3) + phase * 2) * 0.1
          const noise = (Math.random() - 0.5) * amplitude * 0.05
          
          // Simulate defuzzing effect - cleaner waveform
          const processedNoise = noise * 0.3 // Reduced noise
          const y = (height / 2) + (sine * amplitude) + (harmonic1 * amplitude * 0.5) + (harmonic2 * amplitude * 0.3) + processedNoise

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()

        // Draw processed harmonics (cleaner)
        ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()

        for (let x = 0; x < width; x++) {
          const harmonic = Math.sin((x * frequency * 2) + phase) * 0.5
          const y = (height / 2) + (harmonic * amplitude * 0.4) // Reduced amplitude for cleaner look

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()

        // Draw presence enhancement indicator
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)'
        ctx.lineWidth = 1
        ctx.beginPath()

        for (let x = 0; x < width; x++) {
          const presence = Math.sin((x * frequency * 4) + phase * 3) * 0.2
          const y = (height / 2) + (presence * amplitude * 0.2)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()

        phase += 0.05
      } else {
        // Idle state - draw center line
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.stroke()

        // Draw idle text
        ctx.fillStyle = 'rgba(0, 255, 65, 0.2)'
        ctx.font = '14px "IBM Plex Mono"'
        ctx.textAlign = 'center'
        ctx.fillText('WAITING FOR INPUT', width / 2, height / 2 - 10)
        ctx.fillText('Press START to begin processing', width / 2, height / 2 + 15)
      }

      animationRef.current = requestAnimationFrame(drawVisualizer)
    }

    drawVisualizer()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isProcessing])

  return (
    <div className="visualizer-container">
      <canvas ref={canvasRef} className="visualizer-canvas"></canvas>
    </div>
  )
}
