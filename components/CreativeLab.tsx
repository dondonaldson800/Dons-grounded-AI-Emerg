
import React, { useState, useRef } from 'react';
import { generateImage, generateVideo, animateImage, fileToBase64 } from '../services/gemini';
import { SubscriptionTier } from '../types';
import { useUser } from '../contexts/UserContext';

interface CreativeLabProps {
  tier: SubscriptionTier;
  setShowPricing: (show: boolean) => void;
}

const CreativeLab: React.FC<CreativeLabProps> = ({ tier, setShowPricing }) => {
  const { incrementTaskCount } = useUser();
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'image' | 'video' | 'animate'>('image');
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [imageSize, setImageSize] = useState<"512px" | "1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratios = ["1:1", "3:4", "4:3", "9:16", "16:9", "1:4", "4:1"];
  const sizes = ["512px", "1K", "2K", "4K"];

  const handleGenerate = async () => {
    setInlineNotice(null);
    if (!prompt.trim() && type !== 'animate') return;
    if (type === 'animate' && !sourceImage) {
      setInlineNotice("Please upload a source image to animate.");
      return;
    }

    // Tier checks
    if ((type === 'video' || type === 'animate') && tier !== SubscriptionTier.ELITE) {
      setInlineNotice("Video features require Elite tier. You can upgrade anytime or generate unlimited images below.");
      setShowPricing(true);
      return;
    }

    setIsGenerating(true);
    setResult(null);
    try {
      if (type === 'image') {
        const url = await generateImage(prompt, aspectRatio, imageSize);
        setResult(url);
        incrementTaskCount();
      } else if (type === 'video') {
        const url = await generateVideo(prompt, aspectRatio as '16:9' | '9:16');
        setResult(url);
        incrementTaskCount();
      } else if (type === 'animate' && sourceImage) {
        const base64 = await fileToBase64(sourceImage);
        const url = await animateImage(base64, sourceImage.type, prompt, aspectRatio as '16:9' | '9:16');
        setResult(url);
        incrementTaskCount();
      }
    } catch (error: any) {
      console.error("Creative generation error:", error);
      setInlineNotice("Processing completed or model is busy. Please try a different prompt or resolution.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">Image Generator</h2>
          <p className="text-slate-400 text-sm">Create stunning visuals with Gemini Pro & Veo 3.</p>
        </header>

        {inlineNotice && (
          <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-medium flex items-center justify-between">
            <span>{inlineNotice}</span>
            <button onClick={() => setInlineNotice(null)} className="text-amber-400 font-bold ml-2">✕</button>
          </div>
        )}

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex gap-4 border-b border-slate-800 pb-4 overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setType('image')}
              className={`min-w-[120px] py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${type === 'image' ? 'bg-indigo-600 shadow-lg' : 'bg-slate-800 text-slate-400'}`}
            >
              <span className="text-2xl">🖼️</span>
              <span className="text-[10px] font-black uppercase tracking-tight">Imagen 3 Pro</span>
            </button>
            <button 
              onClick={() => setType('video')}
              className={`min-w-[120px] py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${type === 'video' ? 'bg-pink-600 shadow-lg' : 'bg-slate-800 text-slate-400'} ${tier !== SubscriptionTier.ELITE ? 'opacity-50' : ''}`}
            >
              <span className="text-2xl">🎬</span>
              <span className="text-[10px] font-black uppercase tracking-tight">Veo 3.1 {tier !== SubscriptionTier.ELITE && "🔒"}</span>
            </button>
            <button 
              onClick={() => setType('animate')}
              className={`min-w-[120px] py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${type === 'animate' ? 'bg-amber-600 shadow-lg' : 'bg-slate-800 text-slate-400'} ${tier !== SubscriptionTier.ELITE ? 'opacity-50' : ''}`}
            >
              <span className="text-2xl">✨</span>
              <span className="text-[10px] font-black uppercase tracking-tight">Animate {tier !== SubscriptionTier.ELITE && "🔒"}</span>
            </button>
          </div>

          {type === 'animate' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all overflow-hidden"
              >
                {sourceImage ? (
                  <img src={URL.createObjectURL(sourceImage)} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <span className="text-2xl mb-1">📸</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Photo</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setSourceImage(e.target.files?.[0] || null)}
              />
            </div>
          )}

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={type === 'animate' ? "Describe how to animate it (optional)..." : "Describe your vision..."}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {(type !== 'image' ? ["16:9", "9:16"] : ratios).map(r => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                      aspectRatio === r ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {type === 'image' && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolution</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setImageSize(s as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                        imageSize === s ? 'bg-white text-slate-900 border-white' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-white text-slate-900 disabled:opacity-50`}
          >
            {isGenerating ? 'Dreaming...' : `Generate ${type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'Animation'}`}
          </button>
        </div>

        {result && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            {type === 'image' ? <img src={result} className="w-full" alt="Gen" /> : <video src={result} className="w-full" controls autoPlay loop />}
            <div className="p-4 flex justify-between items-center text-xs">
              <span className="text-slate-500 italic">Grounded Creator System</span>
              <a href={result} download className="bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-700">Download</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeLab;
