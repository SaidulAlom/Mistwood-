/**
 * playSizzle — a short synthesized "tsss" (filtered white noise).
 *
 * Generated with the Web Audio API so the site ships zero audio files.
 * Triggered by the draggable chili.
 */
export function playSizzle() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    const ac = new AC();
    const dur = 0.7;
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const src = ac.createBufferSource();
    src.buffer = buf;

    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(1600, ac.currentTime);
    bp.frequency.exponentialRampToValueAtTime(4400, ac.currentTime + dur);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ac.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(ac.destination);
    src.start();
    if (ac.state === 'suspended') ac.resume();
    setTimeout(() => ac.close(), dur * 1000 + 200);
  } catch (e) {
    /* audio unavailable — fail silently, the confetti still fires */
  }
}
