import { useState, useEffect, useRef, useCallback } from 'react';
import AudioEngine from '../audio/AudioEngine.js';

export function useAudioEngine() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [parameters, setParameters] = useState({
    intensity: 0.65,
    threshold: 0.45,
    presence: 0.55,
    inputLevel: 0.5,
    outputLevel: 0.5
  });
  
  const audioEngineRef = useRef(null);

  useEffect(() => {
    // Initialize audio engine on mount
    const initEngine = async () => {
      audioEngineRef.current = new AudioEngine();
      
      audioEngineRef.current.onStateChange = (state, engineState) => {
        setIsInitialized(engineState.isInitialized);
        setIsLoaded(engineState.isLoaded);
        setIsPlaying(engineState.isPlaying);
        setParameters(engineState.parameters);
      };

      audioEngineRef.current.onError = (message, error) => {
        console.error('Audio Engine Error:', message, error);
      };

      await audioEngineRef.current.initialize();
    };

    initEngine();

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);

  const loadDefaultSample = useCallback(async () => {
    if (audioEngineRef.current) {
      return await audioEngineRef.current.loadDefaultSample();
    }
    return false;
  }, []);

  const loadAudioFile = useCallback(async (file) => {
    if (audioEngineRef.current) {
      return await audioEngineRef.current.loadAudioFile(file);
    }
    return false;
  }, []);

  const play = useCallback(() => {
    if (audioEngineRef.current) {
      return audioEngineRef.current.play();
    }
    return false;
  }, []);

  const pause = useCallback(() => {
    if (audioEngineRef.current) {
      return audioEngineRef.current.pause();
    }
    return false;
  }, []);

  const stop = useCallback(() => {
    if (audioEngineRef.current) {
      return audioEngineRef.current.stop();
    }
    return false;
  }, []);

  const setParameter = useCallback((param, value) => {
    if (audioEngineRef.current) {
      return audioEngineRef.current.setParameter(param, value);
    }
    return false;
  }, []);

  const getState = useCallback(() => {
    if (audioEngineRef.current) {
      return audioEngineRef.current.getState();
    }
    return {
      isInitialized: false,
      isLoaded: false,
      isPlaying: false,
      parameters: {}
    };
  }, []);

  return {
    isInitialized,
    isLoaded,
    isPlaying,
    parameters,
    loadDefaultSample,
    loadAudioFile,
    play,
    pause,
    stop,
    setParameter,
    getState
  };
}