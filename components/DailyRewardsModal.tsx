import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import confetti from 'canvas-confetti';

interface DailyRewardsModalProps {
  onClose: () => void;
}

const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ onClose }) => {
  const { tokens, consecutiveLogins, claimedToday, claimDailyReward } = useUser();
  const [isClaiming, setIsClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const nextDay = consecutiveLogins + 1;
  
  // Calculate what the reward WILL be (or WAS, if just claimed)
  const calculateReward = (day: number) => {
    let amount = day * 10;
    if (day % 7 === 0) amount += 100;
    if (day % 30 === 0) amount += 500;
    return amount;
  };

  useEffect(() => {
    if (!claimedToday && !justClaimed) {
      setRewardAmount(calculateReward(nextDay));
    }
  }, [claimedToday, nextDay, justClaimed]);

  const handleClaim = async () => {
    setIsClaiming(true);
    await claimDailyReward();
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#818CF8', '#F59E0B', '#10B981']
    });

    setJustClaimed(true);
    setIsClaiming(false);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  // Generate the 7-day visual track
  const currentWeekStart = Math.floor(consecutiveLogins / 7) * 7;
  const daysTrack = Array.from({ length: 7 }).map((_, i) => {
    const dayNum = currentWeekStart + i + 1;
    const isPast = dayNum <= consecutiveLogins;
    const isToday = dayNum === nextDay && !claimedToday;
    const isMilestone = dayNum % 7 === 0;
    const reward = calculateReward(dayNum);
    
    return { dayNum, isPast, isToday, isMilestone, reward };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-8 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20 transform -rotate-6">
            <span className="text-3xl">🎁</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Daily Login Reward</h2>
          <p className="text-slate-400 text-sm font-medium">
            {justClaimed 
              ? "Awesome! You've claimed today's reward." 
              : "Welcome back! Claim your daily tokens to power up your Empire."}
          </p>
        </div>

        {/* Current Stats */}
        <div className="flex justify-center gap-6 relative z-10">
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-center min-w-[120px]">
            <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Streak</div>
            <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              🔥 {justClaimed ? consecutiveLogins : consecutiveLogins}
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-center min-w-[120px]">
            <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Tokens</div>
            <div className="text-2xl font-black text-indigo-400 flex items-center justify-center gap-1">
              🪙 {tokens}
            </div>
          </div>
        </div>

        {/* 7-Day Track */}
        <div className="relative z-10">
          <div className="flex justify-between items-end gap-2">
            {daysTrack.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className={`w-full aspect-[3/4] rounded-xl border flex flex-col items-center justify-center relative transition-all duration-300 ${
                    day.isPast 
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                      : day.isToday
                        ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-400 -translate-y-2'
                        : 'bg-slate-950/50 border-slate-800 text-slate-600'
                  }`}
                >
                  {day.isMilestone && (
                    <div className="absolute -top-3 text-lg drop-shadow-md">👑</div>
                  )}
                  <span className="text-xs font-black mb-1">+{day.reward}</span>
                  <span className="text-[10px] opacity-50 uppercase tracking-wider">Day {day.dayNum}</span>
                  
                  {day.isPast && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl backdrop-blur-[1px]">
                      <span className="text-emerald-400 text-xl">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 relative z-10">
          {!claimedToday && !justClaimed ? (
            <button 
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isClaiming ? 'Claiming...' : `Claim +${rewardAmount} Tokens`}
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all"
            >
              Continue to Empire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyRewardsModal;
