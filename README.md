# The Wired De-Fuzzer

A web-based psychoacoustic processor DAW inspired by Serial Experiments Lain. "The Wired De-Fuzzer" intelligently removes digital artifacts and harshness, giving audio a clean, analog, and 'present' sound through a beautiful, modular interface.

## Design Philosophy

The interface is built around the aesthetic of "The Wired" from Serial Experiments Lain - dark, minimalist with neon green accents, glitch-like typography, and an overall sense of digital transcendence. Every interaction feels purposeful and connected to the core philosophy of the application.

## Project Structure

```
.
├── src/
│   ├── components/           # Modular UI components
│   │   ├── Header.jsx        # Application title and status
│   │   ├── LeftPanel.jsx     # Module selection and navigation
│   │   ├── MainProcessor.jsx # Central processing area
│   │   ├── RightPanel.jsx    # Parameter controls
│   │   ├── BottomPanel.jsx   # Control buttons and status
│   │   ├── Visualizer.jsx    # Canvas-based audio visualizer
│   │   └── [Component].css   # Component-specific styles
│   ├── App.jsx               # Main application component
│   ├── App.css               # Layout and structure
│   ├── index.css             # Global styles and design tokens
│   └── main.jsx              # React entry point
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Fast build tooling and dev server
- **CSS3** - Modern styling with CSS variables for theming
- **Canvas API** - High-performance waveform visualization

## Features

### Core Modules

The application includes 5 psychoacoustic processing modules:

1. **Defuzzer** - Primary artifact removal and clarity enhancement
2. **Harmonic** - Frequency balancing and EQ processing
3. **Presence** - Analog warmth and character enhancement
4. **Dynamics** - Transient control and compression
5. **Spatial** - Stereo processing and imaging

### Interface Components

- **Header** - Application title with pulse-glow effects and status indicator
- **Left Panel** - Module selector with icons and descriptions
- **Main Processor** - Real-time waveform visualizer and level controls
- **Right Panel** - Dynamic parameter controls for the active module
- **Bottom Panel** - Playback controls, presets, and system status

### Visual Features

- Neon green (`#00ff41`) accents with glow effects
- Glitch animation effects for text and UI elements
- Responsive grid layout (1440px → 1024px → 768px breakpoints)
- Canvas-based waveform visualization with real-time updates
- Smooth transitions and interactions throughout

## Getting Started

### Prerequisites

- Node.js 16+ and npm 7+

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will open in your default browser at `http://localhost:5173`

### Build

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Design System

### Color Palette

- **Primary Background**: `#0a0e27` - Deep purple-black
- **Secondary Background**: `#0f1333` - Slightly lighter purple
- **Tertiary Background**: `#151a3a` - UI element background
- **Accent Primary**: `#00ff41` - Neon green for highlights
- **Accent Secondary**: `#0099ff` - Neon blue for secondary accents
- **Accent Tertiary**: `#ff00ff` - Neon magenta for alerts
- **Text Primary**: `#e0e0e0` - Primary text color
- **Text Secondary**: `#8a8a9e` - Secondary text color
- **Borders**: `#1a2550` - Subtle border color

### Typography

- **Sans-serif**: Inter (300, 400, 500, 600, 700 weights)
- **Monospace**: IBM Plex Mono (400, 500, 600 weights)
- **Sizing**: Responsive from 0.65rem (mobile) to 2rem (desktop)

### Animations

- `pulse-glow` - 2-3s pulsing glow effect on accent elements
- `glitch` - 2s digital glitch effect with color shifts
- Transitions: 150ms (fast), 300ms (normal), 500ms (slow)

## Layout

The application uses CSS Grid for a flexible, modular layout:

```
┌─────────────────────────────────────────────┐
│         Header (Full Width)                  │
├────────────┬───────────────────┬─────────────┤
│   Left     │   Main Processor  │    Right    │
│   Panel    │     (Canvas)      │    Panel    │
│ (280px)    │   (Dynamic)       │  (280px)    │
├────────────┼───────────────────┼─────────────┤
│         Bottom Panel (Full Width)            │
│      Controls | Status Info (60px)           │
└────────────┴───────────────────┴─────────────┘
```

Responsive breakpoints:
- **Desktop**: 280px | 1fr | 280px (+ 60px footer)
- **Tablet**: 240px | 1fr | 240px
- **Mobile**: Single column layout (sidebars hidden)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- **Bundle Size**: ~150KB (gzipped: ~48KB JS + ~3.2KB CSS)
- **Build Time**: ~800ms
- **Dev Server**: Instant HMR with Vite

## Future Enhancements

- Audio engine integration with Web Audio API
- Real-time FFT analysis and visualization
- Preset management system
- MIDI control support
- Plugin architecture for custom modules
- Undo/redo functionality
- Waveform editing capabilities

## Contributing

The codebase follows a modular component architecture. Each component is self-contained with:
- Component `.jsx` file (React component logic)
- Component `.css` file (isolated styles)
- Clear separation of concerns

## License

This project is part of the Lain-Defuzzer DAW project.

## References

- **Inspiration**: Serial Experiments Lain anime aesthetic
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
