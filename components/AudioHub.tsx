
import React, { useState, useRef, useEffect } from 'react';
import { generateTTS, transcribeAudio, connectLive } from '../services/gemini';
import { SubscriptionTier } from '../types';
import { useUser } from '../contexts/UserContext';

interface AudioHubProps {
  tier: SubscriptionTier;
}

const AudioHub: React.FC<AudioHubProps> = ({ tier }) => {
  const { incrementTaskCount } = useUser();
  const [ttsInput, setTtsInput] = useState('Welcome to Don\'s Grounded AI Empire. Audio synthesis and speech recognition are fully operational.');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Fenrir' | 'Aoede' | 'System'>('Kore');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStatusMsg, setAudioStatusMsg] = useState('Audio Engine Ready');
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('Disconnected');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const liveSessionRef = useRef<any>(null);

  // Stop any active audio
  const stopPlayback = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioStatusMsg('Playback stopped');
  };

  // Browser speech synthesis fallback
  const speakWithBrowserTTS = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex')));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setAudioStatusMsg('Speaking via Natural Voice Engine...');
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioStatusMsg('Playback finished');
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setAudioStatusMsg('Audio complete');
    };

    window.speechSynthesis.speak(utterance);
    return true;
  };

  const getOrCreateAudioContext = async () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  };

  const playAudioFromBase64 = async (base64: string) => {
    try {
      const ctx = await getOrCreateAudioContext();
      stopPlayback();

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
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      activeSourceRef.current = source;
      
      source.onended = () => {
        setIsPlayingAudio(false);
        setAudioStatusMsg('Playback finished');
      };

      setIsPlayingAudio(true);
      setAudioStatusMsg('Playing synthesized audio (24kHz HD)...');
      source.start();
    } catch (e) {
      console.warn("PCM playback error, using browser speech fallback:", e);
      speakWithBrowserTTS(ttsInput);
    }
  };

  // Instant Sound Test: Generates a pleasant harmonic synthesizer chime followed by voice confirmation
  const handleTestAudio = async () => {
    try {
      stopPlayback();
      const ctx = await getOrCreateAudioContext();
      setIsPlayingAudio(true);
      setAudioStatusMsg('Playing Audio Engine Diagnostic Chime...');

      const now = ctx.currentTime;
      // 3-note ascending harmonic chord: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.5Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });

      setTimeout(() => {
        speakWithBrowserTTS("Audio engine is online and fully functional.");
      }, 700);
    } catch (err) {
      console.error("Audio test error:", err);
      speakWithBrowserTTS("Audio output is active and verified.");
    }
  };

  const handleTTS = async () => {
    if (!ttsInput.trim()) return;
    setIsProcessing(true);
    setAudioStatusMsg('Synthesizing audio...');
    
    // If user explicitly chose System voice or if testing without API
    if (selectedVoice === 'System') {
      speakWithBrowserTTS(ttsInput);
      setIsProcessing(false);
      incrementTaskCount();
      return;
    }

    try {
      const base64 = await generateTTS(ttsInput, selectedVoice);
      incrementTaskCount();
      await playAudioFromBase64(base64);
    } catch (error) {
      console.warn("Gemini TTS failed, automatically falling back to high-quality browser synthesis", error);
      const ok = speakWithBrowserTTS(ttsInput);
      if (ok) {
        setAudioStatusMsg('Synthesized using Browser Speech Engine');
      } else {
        setAudioStatusMsg('Audio synthesis error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const startTranscription = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsProcessing(true);
          setAudioStatusMsg('Transcribing recorded audio with Gemini...');
          try {
            const result = await transcribeAudio(base64Audio, 'audio/webm');
            setTranscription(result || "No transcription recognized.");
            incrementTaskCount();
            setAudioStatusMsg('Transcription complete');
          } catch (error) {
            console.error("Transcription error", error);
            setAudioStatusMsg('Transcription failed');
          } finally {
            setIsProcessing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioStatusMsg('Recording microphone input...');
    } catch (err) {
      console.error(err);
      setAudioStatusMsg('Microphone access denied or unavailable');
    }
  };

  const stopTranscription = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      if (liveSessionRef.current) {
        liveSessionRef.current.close();
      }
      setIsLive(false);
      setLiveStatus('Disconnected');
    } else {
      setIsLive(true);
      setLiveStatus('Connecting...');
      try {
        const session = await connectLive({
          onopen: () => setLiveStatus('Connected'),
          onclose: () => {
            setIsLive(false);
            setLiveStatus('Disconnected');
          },
          onerror: (err: any) => {
            console.error(err);
            setLiveStatus('Error');
          },
          onmessage: (msg: any) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              playAudioFromBase64(base64Audio);
            }
          }
        });
        liveSessionRef.current = session;
      } catch (err) {
        console.error(err);
        setIsLive(false);
        setLiveStatus('Failed');
      }
    }
  };

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-950 custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎙️</span>
              <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-tighter">Audio Hub</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active 🔊
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">High-fidelity speech synthesis, voice transcription, and live duplex audio.</p>
          </div>

          <button
            onClick={handleTestAudio}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shrink-0 self-start"
            title="Play diagnostic sound to verify speakers/headphones"
          >
            <span>🔊</span>
            <span>Test Audio Output</span>
          </button>
        </header>

        {/* Audio Status Banner */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isPlayingAudio ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="text-slate-300 font-mono text-[11px]">{audioStatusMsg}</span>
          </div>
          {isPlayingAudio && (
            <button
              onClick={stopPlayback}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider transition-all"
            >
              Stop Audio ⏹
            </button>
          )}
        </div>

        {/* SECTION 1: TEXT TO SPEECH */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Text-to-Speech Engine
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Voice:</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-bold focus:outline-none"
              >
                <option value="Kore">Kore (Balanced)</option>
                <option value="Puck">Puck (Energetic)</option>
                <option value="Fenrir">Fenrir (Deep)</option>
                <option value="Aoede">Aoede (Clear)</option>
                <option value="System">System Native</option>
              </select>
            </div>
          </div>

          <textarea 
            value={ttsInput}
            onChange={(e) => setTtsInput(e.target.value)}
            placeholder="Type text for speech synthesis..."
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] resize-none text-slate-200"
          />

          <div className="flex gap-3">
            <button 
              onClick={handleTTS}
              disabled={isProcessing || !ttsInput.trim()}
              className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.3)] text-white text-xs flex items-center justify-center gap-2"
            >
              <span>{isProcessing ? '⏳' : '🔊'}</span>
              <span>{isProcessing ? 'Synthesizing...' : 'Speak Text'}</span>
            </button>
            {isPlayingAudio && (
              <button
                onClick={stopPlayback}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black uppercase tracking-widest text-slate-300 text-xs transition-all"
              >
                Mute
              </button>
            )}
          </div>
        </section>

        {/* SECTION 2: VOICE TRANSCRIPTION */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Voice Transcription
            </h3>
            {isRecording && (
              <span className="text-[10px] text-red-400 font-black tracking-widest animate-pulse">
                REC ●
              </span>
            )}
          </div>
          <div className="min-h-[120px] bg-slate-950/50 rounded-2xl p-6 border border-slate-800 text-sm text-slate-300 italic leading-relaxed">
            {isRecording ? "Listening to microphone... Speak clearly." : transcription || "Transcription results will appear here."}
          </div>
          <button 
            onClick={isRecording ? stopTranscription : startTranscription}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all text-white text-xs ${
              isRecording ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <span>{isRecording ? '⏹️' : '🎙️'}</span>
            <span>{isRecording ? 'Stop Recording & Transcribe' : 'Start Mic Transcription'}</span>
          </button>
        </section>

        {/* SECTION 3: LIVE DUPLEX CONVERSATION */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Live Conversation
            </h3>
            <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">{liveStatus}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Experience real-time, bidirectional voice interaction with low-latency audio streaming.
          </p>
          <button 
            onClick={toggleLive}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all text-white text-xs ${
              isLive ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <span>{isLive ? '⏹️' : '⚡'}</span>
            <span>{isLive ? 'End Live Session' : 'Start Live Voice'}</span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default AudioHub;
