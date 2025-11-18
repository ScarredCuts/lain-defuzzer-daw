class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.defuzzerNode = null;
    this.gainNode = null;
    this.inputGainNode = null;
    this.source = null;
    this.buffer = null;
    this.isPlaying = false;
    this.startTime = 0;
    this.pauseTime = 0;
    this.loop = false;
    
    // Parameters
    this.parameters = {
      intensity: 0.65,
      threshold: 0.45,
      presence: 0.55,
      inputLevel: 0.5,
      outputLevel: 0.5
    };
    
    // Callbacks
    this.onStateChange = null;
    this.onError = null;
  }

  async initialize() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Load the defuzzer worklet
      await this.audioContext.audioWorklet.addModule('/audio/defuzzer-processor.js');
      
      // Create audio nodes
      this.defuzzerNode = new AudioWorkletNode(this.audioContext, 'defuzzer-processor');
      this.inputGainNode = this.audioContext.createGain();
      this.gainNode = this.audioContext.createGain();
      
      // Set initial gain values
      this.inputGainNode.gain.value = this.parameters.inputLevel;
      this.gainNode.gain.value = this.parameters.outputLevel;
      
      // Connect nodes: input -> inputGain -> defuzzer -> outputGain -> destination
      this.inputGainNode.connect(this.defuzzerNode);
      this.defuzzerNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Update defuzzer parameters
      this.updateDefuzzerParameters();
      
      this.notifyStateChange('initialized');
      return true;
    } catch (error) {
      this.handleError('Failed to initialize audio engine', error);
      return false;
    }
  }

  async loadAudioFile(file) {
    try {
      if (!this.audioContext) {
        await this.initialize();
      }

      const arrayBuffer = await file.arrayBuffer();
      this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.notifyStateChange('loaded');
      return true;
    } catch (error) {
      this.handleError('Failed to load audio file', error);
      return false;
    }
  }

  async loadDefaultSample() {
    try {
      // Create a simple drum loop programmatically
      if (!this.audioContext) {
        await this.initialize();
      }

      const sampleRate = this.audioContext.sampleRate;
      const duration = 2.0; // 2 seconds
      const length = sampleRate * duration;
      
      this.buffer = this.audioContext.createBuffer(2, length, sampleRate);
      
      // Generate a simple drum pattern
      for (let channel = 0; channel < 2; channel++) {
        const channelData = this.buffer.getChannelData(channel);
        
        // Kick drum at 0, 0.5, 1, 1.5 seconds
        for (let beat = 0; beat < 4; beat++) {
          const kickStart = Math.floor(beat * 0.5 * sampleRate);
          const kickLength = Math.floor(0.05 * sampleRate);
          
          for (let i = 0; i < kickLength; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 50);
            channelData[kickStart + i] = Math.sin(2 * Math.PI * 60 * t) * envelope * 0.5;
          }
        }
        
        // Hi-hat at eighth notes
        for (let beat = 0; beat < 8; beat++) {
          const hihatStart = Math.floor(beat * 0.25 * sampleRate);
          const hihatLength = Math.floor(0.02 * sampleRate);
          
          for (let i = 0; i < hihatLength; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 200);
            const noise = (Math.random() - 0.5) * envelope * 0.1;
            channelData[hihatStart + i] = noise;
          }
        }
        
        // Snare at 0.5 and 1.5 seconds
        for (let beat = 1; beat < 4; beat += 2) {
          const snareStart = Math.floor(beat * 0.5 * sampleRate);
          const snareLength = Math.floor(0.1 * sampleRate);
          
          for (let i = 0; i < snareLength; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 30);
            const tone = Math.sin(2 * Math.PI * 200 * t) * envelope * 0.3;
            const noise = (Math.random() - 0.5) * envelope * 0.2;
            channelData[snareStart + i] = tone + noise;
          }
        }
      }
      
      this.notifyStateChange('loaded');
      return true;
    } catch (error) {
      this.handleError('Failed to create default sample', error);
      return false;
    }
  }

  play() {
    if (!this.buffer || !this.audioContext) {
      this.handleError('No audio loaded or engine not initialized');
      return false;
    }

    // Stop current playback if any
    this.stop();

    // Create new source
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = this.loop;

    // Connect to input gain node
    this.source.connect(this.inputGainNode);

    // Start playback
    const offset = this.pauseTime;
    this.source.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.isPlaying = true;

    // Handle end of playback
    this.source.onended = () => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.pauseTime = 0;
        this.notifyStateChange('stopped');
      }
    };

    this.notifyStateChange('playing');
    return true;
  }

  pause() {
    if (!this.isPlaying || !this.source) {
      return false;
    }

    this.pauseTime = this.audioContext.currentTime - this.startTime;
    this.stop();
    this.notifyStateChange('paused');
    return true;
  }

  stop() {
    if (this.source) {
      try {
        this.source.stop();
        this.source.disconnect();
      } catch (e) {
        // Source might have already stopped
      }
      this.source = null;
    }

    this.isPlaying = false;
    this.pauseTime = 0;
    this.notifyStateChange('stopped');
    return true;
  }

  setParameter(param, value) {
    if (this.parameters.hasOwnProperty(param)) {
      this.parameters[param] = value;
      
      // Update audio nodes if they exist
      if (this.audioContext) {
        switch (param) {
          case 'inputLevel':
            if (this.inputGainNode) {
              this.inputGainNode.gain.value = value;
            }
            break;
          case 'outputLevel':
            if (this.gainNode) {
              this.gainNode.gain.value = value;
            }
            break;
          case 'intensity':
          case 'threshold':
          case 'presence':
            this.updateDefuzzerParameters();
            break;
        }
      }
      
      return true;
    }
    return false;
  }

  updateDefuzzerParameters() {
    if (this.defuzzerNode) {
      this.defuzzerNode.port.postMessage({
        type: 'updateParams',
        intensity: this.parameters.intensity,
        threshold: this.parameters.threshold,
        presence: this.parameters.presence
      });
    }
  }

  getState() {
    return {
      isInitialized: !!this.audioContext,
      isLoaded: !!this.buffer,
      isPlaying: this.isPlaying,
      parameters: { ...this.parameters }
    };
  }

  notifyStateChange(state) {
    if (this.onStateChange) {
      this.onStateChange(state, this.getState());
    }
  }

  handleError(message, error) {
    console.error(message, error);
    if (this.onError) {
      this.onError(message, error);
    }
  }

  dispose() {
    this.stop();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.defuzzerNode = null;
    this.gainNode = null;
    this.inputGainNode = null;
    this.buffer = null;
  }
}

export default AudioEngine;