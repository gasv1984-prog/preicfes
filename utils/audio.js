let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sonido de Acierto Premium: Arpegio celestial y brillante con coro
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Frecuencias: C5, E5, G5, C6, E6
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    
    notes.forEach((freq, index) => {
      const timeOffset = index * 0.06;
      const playTime = now + timeOffset;
      
      // Oscilador 1: Onda Senoidal (brillante y limpia)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, playTime);
      
      // Oscilador 2: Onda Triangular desinada (para cuerpo y coro)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq + 3, playTime); // Desafinado ligeramente (+3Hz)
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, playTime);
      gainNode.gain.linearRampToValueAtTime(0.12, playTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, playTime + 0.4);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start(playTime);
      osc2.start(playTime);
      osc1.stop(playTime + 0.45);
      osc2.stop(playTime + 0.45);
    });
  } catch (e) {
    console.warn("No se pudo reproducir el sonido de acierto:", e);
  }
};

// Sonido de Desacierto: Efecto "Sad Trombone" (Trombón triste) en 4 notas descendentes con vibrato
export const playFailureSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Notas del trombón triste: Bb3 (233Hz), A3 (220Hz), Ab3 (208Hz), G3 (196Hz)
    const notes = [233.08, 220.00, 207.65, 196.00];
    const duration = 0.22; // Duración de las primeras notas
    
    notes.forEach((freq, index) => {
      const isLast = index === notes.length - 1;
      const timeOffset = index * 0.25;
      const playTime = now + timeOffset;
      const noteDuration = isLast ? 0.6 : duration;
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Tipo de onda diente de sierra para simular instrumento de viento de metal
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, playTime);
      
      // Caída leve de tono durante cada nota (portamento)
      osc.frequency.linearRampToValueAtTime(freq - 10, playTime + noteDuration);
      
      // Filtro pasa bajos con resonancia para filtrar armónicos chillones
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, playTime);
      filter.frequency.linearRampToValueAtTime(300, playTime + noteDuration);
      filter.Q.setValueAtTime(6, playTime);
      
      // Ganancia y decaimiento
      gainNode.gain.setValueAtTime(0.001, playTime);
      gainNode.gain.linearRampToValueAtTime(0.18, playTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.15, playTime + noteDuration - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, playTime + noteDuration);
      
      // Agregar efecto de Vibrato (LFO) a la última nota
      if (isLast) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(9, playTime); // Frecuencia de wobble (9Hz)
        
        lfoGain.gain.setValueAtTime(8, playTime); // Profundidad de vibrato (+/- 8Hz)
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        lfo.start(playTime);
        lfo.stop(playTime + noteDuration);
      }
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(playTime);
      osc.stop(playTime + noteDuration);
    });
  } catch (e) {
    console.warn("No se pudo reproducir el sonido de desacierto:", e);
  }
};

// Sonido de Felicitaciones / Fin de Módulo (Fanfarria Triunfal)
export const playCompletionSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Fanfarria: Do4, Mi4, Sol4, Do5, Mi5, Sol5, Do6 en arpegio ascendente sostenido
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const timeOffset = index * 0.08;
      const playTime = now + timeOffset;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, playTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, playTime);
      
      gainNode.gain.setValueAtTime(0.001, playTime);
      gainNode.gain.linearRampToValueAtTime(0.12, playTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.1, playTime + 0.6 - timeOffset);
      gainNode.gain.exponentialRampToValueAtTime(0.001, playTime + 1.2 - timeOffset);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(playTime);
      osc.stop(playTime + 1.3 - timeOffset);
    });
  } catch (e) {
    console.warn("No se pudo reproducir el sonido de felicitaciones:", e);
  }
};
