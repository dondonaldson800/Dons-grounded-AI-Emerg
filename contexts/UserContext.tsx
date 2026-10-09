
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../services/firebase';
import { SubscriptionTier } from '../types';
import { AdService } from '../services/AdService';

interface UserContextType {
  user: User | null;
  tier: SubscriptionTier;
  loading: boolean;
  isConfigured: boolean;
  taskCount: number;
  tokens: number;
  consecutiveLogins: number;
  claimedToday: boolean;
  ownedItems: string[];
  activeBadge: string | null;
  healthMetrics: { label: string; value: string; unit: string; trend: 'up' | 'down' | 'stable' }[];
  isMasterDeveloper: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateTier: (newTier: SubscriptionTier) => Promise<void>;
  unlockElite: (secret?: string) => Promise<boolean>;
  startEliteAccess: () => Promise<void>;
  incrementTaskCount: () => void;
  claimDailyReward: () => Promise<void>;
  purchaseItem: (itemId: string, cost: number, type: 'badge' | 'perk') => Promise<boolean>;
  addTokens: (amount: number) => Promise<void>;
  equipBadge: (itemId: string) => Promise<void>;
  resetAll: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<SubscriptionTier>(() => {
    if (typeof window !== 'undefined') {
      const savedTier = localStorage.getItem('empire_tier');
      if (savedTier === SubscriptionTier.ELITE || savedTier === SubscriptionTier.PRO || savedTier === SubscriptionTier.FREE) {
        return savedTier as SubscriptionTier;
      }
    }
    // Default to ELITE for Master Developer
    return SubscriptionTier.ELITE;
  });
  const [isMasterDeveloper, setIsMasterDeveloper] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [tokens, setTokens] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = parseInt(localStorage.getItem('empire_tokens') || '0', 10);
      return saved > 0 ? saved : 99999;
    }
    return 99999;
  });
  const [consecutiveLogins, setConsecutiveLogins] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null);
  const [claimedToday, setClaimedToday] = useState(false);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [healthMetrics, setHealthMetrics] = useState([
    { label: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable' as const },
    { label: 'Sleep', value: '7.5', unit: 'hrs', trend: 'up' as const },
    { label: 'Steps', value: '8,432', unit: 'steps', trend: 'up' as const },
    { label: 'Hydration', value: '1.2', unit: 'L', trend: 'down' as const },
  ]);

  useEffect(() => {
    // LocalStorage initialization fallback
    const savedTier = localStorage.getItem('empire_tier') as SubscriptionTier;
    const activeTier = savedTier || SubscriptionTier.ELITE;
    localStorage.setItem('empire_tier', activeTier);
    localStorage.setItem('empire_master_developer', 'true');
    setTier(activeTier);
    setIsMasterDeveloper(true);

    const localTokens = parseInt(localStorage.getItem('empire_tokens') || '99999', 10) || 99999;
    const localConsecutive = parseInt(localStorage.getItem('empire_consecutive') || '0') || 0;
    const localLastLogin = localStorage.getItem('empire_last_login');
    let localOwned = [];
    try {
      const stored = localStorage.getItem('empire_owned_items');
      if (stored && stored !== 'undefined') {
        localOwned = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse owned items", e);
    }
    const localBadge = localStorage.getItem('empire_active_badge') || 'badge_founder';
    
    const today = new Date().toISOString().split('T')[0];
    
    let currentConsecutive = localConsecutive;
    let isClaimed = false;

    if (localLastLogin === today) {
      isClaimed = true;
    } else if (localLastLogin) {
      const lastDate = new Date(localLastLogin);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        currentConsecutive = 0;
      }
    }

    setTokens(localTokens);
    setConsecutiveLogins(currentConsecutive);
    setLastLoginDate(localLastLogin);
    setClaimedToday(isClaimed);
    setOwnedItems(localOwned.length > 0 ? localOwned : ['badge_founder', 'badge_ai_master', 'badge_elite_patron']);
    setActiveBadge(localBadge);

    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      const isDon = currentUser?.email?.toLowerCase().includes('dondonaldson800') || 
                    localStorage.getItem('empire_master_developer') === 'true';
      
      if (currentUser && db) {
        // Listen for tier changes in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        // Initial fetch
        try {
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            let currentTier = isDon ? SubscriptionTier.ELITE : (data.tier || SubscriptionTier.FREE);
            
            setTier(currentTier);
            setIsMasterDeveloper(isDon);
            
            const dbTokens = isDon ? 99999 : (data.tokens !== undefined ? data.tokens : 3);
            const dbConsecutive = data.consecutiveLogins || 1;
            const dbLastLogin = data.lastLoginDate || null;
            const dbOwned = data.ownedItems || (isDon ? ['badge_founder', 'badge_ai_master', 'badge_elite_patron'] : []);
            const dbBadge = data.activeBadge || (isDon ? 'badge_founder' : null);
            
            setTokens(dbTokens);
            setConsecutiveLogins(dbConsecutive);
            setLastLoginDate(dbLastLogin);
            setClaimedToday(true);
            setOwnedItems(dbOwned);
            setActiveBadge(dbBadge);
          } else {
            const initialTier = isDon ? SubscriptionTier.ELITE : SubscriptionTier.FREE;
            const initialTokens = isDon ? 99999 : 3;
            // Create user doc if it doesn't exist
            await setDoc(userDocRef, {
              email: currentUser.email,
              tier: initialTier,
              createdAt: new Date().toISOString(),
              tokens: initialTokens,
              consecutiveLogins: 1,
              lastLoginDate: new Date().toISOString(),
              ownedItems: isDon ? ['badge_founder', 'badge_ai_master', 'badge_elite_patron'] : [],
              activeBadge: isDon ? 'badge_founder' : null
            });
            setTier(initialTier);
            setTokens(initialTokens);
            setIsMasterDeveloper(isDon);
            setConsecutiveLogins(1);
            setClaimedToday(true);
            setOwnedItems(isDon ? ['badge_founder', 'badge_ai_master', 'badge_elite_patron'] : []);
            setActiveBadge(isDon ? 'badge_founder' : null);
          }
        } catch (error) {
          console.error("Error fetching or creating user doc:", error);
          if (isDon) {
            setTier(SubscriptionTier.ELITE);
            setTokens(99999);
            setIsMasterDeveloper(true);
          } else {
            setTier(SubscriptionTier.FREE);
            setTokens(3);
            setIsMasterDeveloper(false);
          }
        }

        // Real-time listener
        const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setTier(isDon ? SubscriptionTier.ELITE : (data.tier || SubscriptionTier.FREE));
            if (data.tokens !== undefined) setTokens(isDon ? 99999 : data.tokens);
            if (data.ownedItems !== undefined) setOwnedItems(data.ownedItems);
            if (data.activeBadge !== undefined) setActiveBadge(data.activeBadge);
          }
        }, (error) => {
          console.error("Firestore listener error:", error);
        });

        setLoading(false);
        return () => unsubscribeDoc();
      } else {
        const isMaster = localStorage.getItem('empire_master_developer') === 'true';
        if (isMaster) {
          setTier(SubscriptionTier.ELITE);
          setTokens(99999);
          setIsMasterDeveloper(true);
        } else {
          // Regular unauthenticated user must pay or use trial
          setTier(SubscriptionTier.FREE);
          setTokens(3);
          setIsMasterDeveloper(false);
        }
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signIn = async () => {
    if (!auth || !googleProvider) {
      alert("Firebase is not configured. Please set your environment variables.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth error", error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updateTier = async (newTier: SubscriptionTier) => {
    setTier(newTier);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empire_tier', newTier);
    }
    if (user && db) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { tier: newTier }, { merge: true });
      } catch (error) {
        console.error("Update tier error", error);
      }
    }
  };

  const startEliteAccess = async () => {
    setTier(SubscriptionTier.ELITE);
    setIsMasterDeveloper(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empire_tier', SubscriptionTier.ELITE);
      localStorage.setItem('empire_master_developer', 'true');
      if (tokens < 10000) {
        setTokens(99999);
        localStorage.setItem('empire_tokens', '99999');
      }
      if (!ownedItems.includes('badge_founder')) {
        const newOwned = Array.from(new Set([...ownedItems, 'badge_founder', 'badge_ai_master', 'badge_elite_patron']));
        setOwnedItems(newOwned);
        localStorage.setItem('empire_owned_items', JSON.stringify(newOwned));
      }
    }
    if (user && db) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { 
          tier: SubscriptionTier.ELITE, 
          isMasterDeveloper: true,
          tokens: 99999 
        }, { merge: true });
      } catch (e) {
        console.error("Firestore elite sync error:", e);
      }
    }
  };

  const unlockElite = async (secret?: string): Promise<boolean> => {
    // Secret values or master developer bypass
    if (!secret || secret === 'DON_EMPIRE_2026' || secret.toUpperCase() === 'MASTER_DEV' || secret.toUpperCase() === 'ELITE') {
      await startEliteAccess();
      return true;
    }
    return false;
  };

  const incrementTaskCount = () => {
    if (tier === SubscriptionTier.FREE) {
      setTaskCount(prev => {
        const next = prev + 1;
        if (next >= 5) {
          AdService.showInterstitial();
          return 0;
        }
        return next;
      });
    }
  };

  const claimDailyReward = async () => {
    if (claimedToday) return;

    const today = new Date().toISOString().split('T')[0];
    const newConsecutive = consecutiveLogins + 1;
    
    // Calculate reward
    let reward = newConsecutive * 10;
    if (newConsecutive % 7 === 0) reward += 100; // Weekly bonus
    if (newConsecutive % 30 === 0) reward += 500; // Monthly bonus

    const newTokens = tokens + reward;

    setTokens(newTokens);
    setConsecutiveLogins(newConsecutive);
    setLastLoginDate(today);
    setClaimedToday(true);

    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        tokens: newTokens,
        consecutiveLogins: newConsecutive,
        lastLoginDate: today
      }, { merge: true });
    } else {
      // LocalStorage fallback
      localStorage.setItem('empire_tokens', newTokens.toString());
      localStorage.setItem('empire_consecutive', newConsecutive.toString());
      localStorage.setItem('empire_last_login', today);
    }
  };

  const purchaseItem = async (itemId: string, cost: number, type: 'badge' | 'perk'): Promise<boolean> => {
    const currentOwned = ownedItems || [];
    if (tokens < cost) return false;
    if (type === 'badge' && currentOwned.includes(itemId)) return false;

    const newTokens = tokens - cost;
    let newOwned = [...currentOwned];
    let newConsecutive = consecutiveLogins;

    if (type === 'badge') {
      newOwned.push(itemId);
    } else if (itemId === 'perk_streak_repair') {
      newConsecutive += 1; // Artificially boost streak
    }

    setTokens(newTokens);
    if (type === 'badge') setOwnedItems(newOwned);
    if (itemId === 'perk_streak_repair') setConsecutiveLogins(newConsecutive);

    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      const updateData: any = { tokens: newTokens };
      if (type === 'badge') updateData.ownedItems = newOwned;
      if (itemId === 'perk_streak_repair') updateData.consecutiveLogins = newConsecutive;
      await setDoc(userDocRef, updateData, { merge: true });
    } else {
      localStorage.setItem('empire_tokens', newTokens.toString());
      if (type === 'badge') localStorage.setItem('empire_owned_items', JSON.stringify(newOwned));
      if (itemId === 'perk_streak_repair') localStorage.setItem('empire_consecutive', newConsecutive.toString());
    }
    return true;
  };

  const equipBadge = async (itemId: string) => {
    const currentOwned = ownedItems || [];
    if (!currentOwned.includes(itemId)) return;
    
    // Toggle off if already active
    const newBadge = activeBadge === itemId ? null : itemId;
    setActiveBadge(newBadge);

    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { activeBadge: newBadge }, { merge: true });
    } else {
      if (newBadge) {
        localStorage.setItem('empire_active_badge', newBadge);
      } else {
        localStorage.removeItem('empire_active_badge');
      }
    }
  };

  const addTokens = async (amount: number) => {
    const newTokens = tokens + amount;
    setTokens(newTokens);
    if (user && db) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { tokens: newTokens }, { merge: true });
      } catch (err) {
        console.error("Failed to add tokens to firestore", err);
      }
    } else {
      localStorage.setItem('empire_tokens', newTokens.toString());
    }
  };

  const resetAll = async () => {
    setTaskCount(0);
    setTokens(0);
    setConsecutiveLogins(0);
    setClaimedToday(false);
    setOwnedItems([]);
    setActiveBadge(null);
    setHealthMetrics([
      { label: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable' as const },
      { label: 'Sleep', value: '7.5', unit: 'hrs', trend: 'up' as const },
      { label: 'Steps', value: '8,432', unit: 'steps', trend: 'up' as const },
      { label: 'Hydration', value: '1.2', unit: 'L', trend: 'down' as const },
    ]);
    
    localStorage.removeItem('empire_tokens');
    localStorage.removeItem('empire_consecutive');
    localStorage.removeItem('empire_last_login');
    localStorage.removeItem('empire_owned_items');
    localStorage.removeItem('empire_active_badge');
    localStorage.removeItem('empire_task_count');

    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        taskCount: 0,
        tokens: 0,
        consecutiveLogins: 0,
        lastLoginDate: null,
        ownedItems: [],
        activeBadge: null,
        tier: SubscriptionTier.FREE
      }, { merge: true });
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      tier, 
      loading, 
      isConfigured: isFirebaseConfigured,
      taskCount,
      tokens,
      consecutiveLogins,
      claimedToday,
      ownedItems,
      activeBadge,
      healthMetrics,
      isMasterDeveloper,
      signIn, 
      logout, 
      updateTier,
      unlockElite,
      startEliteAccess,
      incrementTaskCount,
      claimDailyReward,
      purchaseItem,
      addTokens,
      equipBadge,
      resetAll
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
