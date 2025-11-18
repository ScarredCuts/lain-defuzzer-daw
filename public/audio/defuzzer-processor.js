class DefuzzerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    
    // Defuzzer parameters
    this.intensity = 0.65;
    this.threshold = 0.45;
    this.presence = 0.55;
    
    // Internal state for multi-band processing
    this.lowBandBuffer = new Float32Array(128);
    this.midBandBuffer = new Float32Array(128);
    this.highBandBuffer = new Float32Array(128);
    
    // Simple low-pass filter state
    this.prevSample = 0;
    this.filterCoeff = 0.3;
    
    // Noise reduction state
    this.noiseGateThreshold = 0.01;
    this.noiseGateRelease = 0.999;
    this.noiseGateState = 0;
    
    // Port for parameter updates
    this.port.onmessage = (event) => {
      if (event.data.type === 'updateParams') {
        this.intensity = event.data.intensity;
        this.threshold = event.data.threshold;
        this.presence = event.data.presence;
      }
    };
  }

  // Simple band-splitting using frequency domain approximation
  splitBands(input) {
    const sampleRate = 48000; // Approximate sample rate
    const nyquist = sampleRate / 2;
    
    // Crossover frequencies (normalized)
    const lowMidFreq = 300 / nyquist;
    const midHighFreq = 3000 / nyquist;
    
    // Simple filters (approximation)
    let low = 0, mid = 0, high = 0;
    
    // Low band (simple low-pass)
    this.lowBandBuffer[this.lowBandBuffer.length - 1] = input;
    for (let i = 0; i < this.lowBandBuffer.length - 1; i++) {
      this.lowBandBuffer[i] = this.lowBandBuffer[i + 1];
    }
    low = this.lowBandBuffer.reduce((a, b) => a + b, 0) / this.lowBandBuffer.length;
    
    // Mid band (band-pass approximation)
    const midFiltered = input - low;
    this.midBandBuffer[this.midBandBuffer.length - 1] = midFiltered;
    for (let i = 0; i < this.midBandBuffer.length - 1; i++) {
      this.midBandBuffer[i] = this.midBandBuffer[i + 1];
    }
    mid = this.midBandBuffer.reduce((a, b) => a + b, 0) / this.midBandBuffer.length;
    
    // High band (high-pass approximation)
    high = input - low - mid;
    
    return { low, mid, high };
  }

  // Multi-band compression
  compressBand(band, intensity, threshold) {
    const absBand = Math.abs(band);
    const sign = band < 0 ? -1 : 1;
    
    // Soft knee compression
    const kneeWidth = 0.1;
    const kneeStart = threshold - kneeWidth / 2;
    const kneeEnd = threshold + kneeWidth / 2;
    
    let gain = 1.0;
    
    if (absBand > kneeStart) {
      if (absBand < kneeEnd) {
        // Soft knee region
        const ratio = 1 + (intensity * 3); // 1:1 to 4:1 ratio based on intensity
        const kneeRatio = (absBand - kneeStart) / kneeWidth;
        gain = 1 - (kneeRatio * (1 - 1/ratio) * (absBand - kneeStart));
      } else {
        // Hard compression region
        const ratio = 1 + (intensity * 3);
        gain = Math.pow(absBand / threshold, 1/ratio - 1);
      }
    }
    
    return sign * absBand * gain;
  }

  // High-frequency exciter
  addExciter(input, presence) {
    // Generate harmonic content
    const harmonic = Math.sign(input) * Math.pow(Math.abs(input), 2) * presence * 0.3;
    
    // Add subtle high-frequency content
    const excited = input + harmonic;
    
    // Gentle high-pass to keep it subtle
    return excited * (1 - this.filterCoeff) + this.prevSample * this.filterCoeff;
  }

  // Noise reduction
  noiseGate(input) {
    const absInput = Math.abs(input);
    
    // Gate detection
    if (absInput > this.noiseGateThreshold) {
      this.noiseGateState = 1.0;
    } else {
      this.noiseGateState *= this.noiseGateRelease;
    }
    
    return input * this.noiseGateState;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !output) return true;
    
    const inputChannel = input[0];
    const outputChannel = output[0];
    
    for (let i = 0; i < inputChannel.length; i++) {
      let sample = inputChannel[i];
      
      // Split into frequency bands
      const bands = this.splitBands(sample);
      
      // Apply multi-band compression
      const compressedLow = this.compressBand(bands.low, this.intensity, this.threshold);
      const compressedMid = this.compressBand(bands.mid, this.intensity * 0.8, this.threshold * 0.9);
      const compressedHigh = this.compressBand(bands.high, this.intensity * 1.2, this.threshold * 1.1);
      
      // Reconstruct signal
      let processed = compressedLow + compressedMid + compressedHigh;
      
      // Apply exciter for presence
      processed = this.addExciter(processed, this.presence);
      
      // Apply noise reduction
      processed = this.noiseGate(processed);
      
      // Gentle limiting to prevent clipping
      const maxLevel = 0.95;
      if (Math.abs(processed) > maxLevel) {
        processed = Math.sign(processed) * maxLevel;
      }
      
      // Store previous sample for filter
      this.prevSample = processed;
      
      outputChannel[i] = processed;
    }
    
    return true;
  }
}

registerProcessor('defuzzer-processor', DefuzzerProcessor);