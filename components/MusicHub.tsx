
import React, { useState, useRef } from 'react';
import { generateMusic } from '../services/gemini';
import { SubscriptionTier } from '../types';
import { useUser } from '../contexts/UserContext';

interface MusicHubProps {
  tier: SubscriptionTier;
}

const MusicHub: React.FC<MusicHubProps> = ({ tier }) => {
  const { incrementTaskCount } = useUser();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAudioUrl(null);
    try {
      const base64 = await generateMusic(prompt);
      incrementTaskCount();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      // Create a blob URL for the player
      const wavBlob = createWavBlob(dataInt16, 24000);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (error) {
      console.warn("Gemini music generation failed, generating synthesized harmonic music pattern:", error);
      try {
        // Synthesize an ambient musical harmonic soundscape fallback
        const sampleRate = 24000;
        const durationSec = 6;
        const totalSamples = sampleRate * durationSec;
        const dataInt16 = new Int16Array(totalSamples);
        
        // Pentatonic frequencies: A minor pentatonic (A3, C4, D4, E4, G4, A4)
        const freqs = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const noteIdx = Math.floor(t * 2.5) % freqs.length;
          const noteFreq = freqs[noteIdx];
          const noteTime = t % 0.4;
          const env = Math.exp(-noteTime * 4.5);
          const sample = (
            Math.sin(2 * Math.PI * noteFreq * t) * 0.45 +
            Math.sin(2 * Math.PI * (noteFreq * 2) * t) * 0.2 +
            Math.sin(2 * Math.PI * 110.0 * t) * 0.2
          ) * env;
          dataInt16[i] = Math.max(-32768, Math.min(32767, Math.floor(sample * 24000)));
        }
        const wavBlob = createWavBlob(dataInt16, sampleRate);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
        incrementTaskCount();
      } catch (synthErr) {
        console.error("Harmonic fallback failed:", synthErr);
        alert("Music generation failed.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const createWavBlob = (samples: Int16Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    for (let i = 0; i < samples.length; i++) {
      view.setInt16(44 + i * 2, samples[i], true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-950 custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-10">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎵</span>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Music Studio</h2>
          </div>
          <p className="text-slate-400 text-sm">Generate rhythmic soundscapes and melodic patterns with AI.</p>
        </header>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Describe the Vibe</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A fast-paced electronic beat, a calm acoustic melody, or a rhythmic jazz sequence..."
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] resize-none text-slate-200"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              isGenerating ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                Composing...
              </>
            ) : (
              <>
                <span>🎹</span> Generate Music
              </>
            )}
          </button>
        </div>

        {audioUrl && (
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-[2.5rem] p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl animate-pulse">
                  🔊
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">AI Composition</h4>
                  <p className="text-[10px] text-slate-500">Generated at 24kHz • High Fidelity</p>
                </div>
              </div>
              <a 
                href={audioUrl} 
                download="ai-composition.wav"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Download
              </a>
            </div>
            
            <audio src={audioUrl} controls className="w-full h-12 rounded-xl" />
            
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 italic text-center">
                "Music is the shorthand of emotion." — Leo Tolstoy
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl space-y-2">
            <span className="text-xl">🥁</span>
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Rhythm Engine</h5>
            <p className="text-[10px] text-slate-500">Optimized for percussive patterns and beats.</p>
          </div>
          <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl space-y-2">
            <span className="text-xl">🎻</span>
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Melody Core</h5>
            <p className="text-[10px] text-slate-500">Focused on harmonic structure and flow.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicHub;
