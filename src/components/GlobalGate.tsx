import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Lock, Sparkles, ShieldCheck, Fingerprint, Keyboard, Triangle, Flame, Zap, Bot, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const CAPTCHA_LENGTH = 6;
const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < CAPTCHA_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const HUD_STYLES = `
  @keyframes scan {
    0% { top: 0%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes shockwave {
    0% { transform: scale(0.8); opacity: 0; }
    50% { opacity: 0.5; }
    100% { transform: scale(2); opacity: 0; }
  }
  @keyframes flicker-in {
    0% { opacity: 0; filter: blur(10px); }
    10% { opacity: 0.5; filter: blur(5px); }
    20% { opacity: 0; filter: blur(10px); }
    100% { opacity: 1; filter: blur(0px); }
  }
  @keyframes thrum {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.02); filter: brightness(1.2); }
  }
  .metallic-gold {
    background: linear-gradient(
      90deg, 
      #b8860b 0%, 
      #ffdf00 25%, 
      #fffacd 50%, 
      #ffdf00 75%, 
      #b8860b 100%
    );
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 3s linear infinite;
    display: inline-block;
  }
  .hud-card {
    position: relative;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(var(--primary), 0.2);
    backdrop-blur: 20px;
  }
  .success-glow {
    box-shadow: 0 0 50px -10px rgba(var(--primary), 0.6);
  }
  .hud-grid {
    background-image: 
      linear-gradient(rgba(145, 45, 35, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(145, 45, 35, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

const HUDCorner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute h-6 w-6 border-primary/40 ${className}`} />
);

const SuccessWaveforms: React.FC = () => (
  <div className="flex items-end gap-1 h-8 opacity-40">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className="w-1 bg-primary rounded-full"
        style={{ 
          height: `${20 + Math.random() * 80}%`,
          animation: `thrum ${0.5 + Math.random() * 0.5}s ease-in-out infinite`
        }} 
      />
    ))}
  </div>
);

const ScanningLine: React.FC = () => (
  <div className="absolute left-0 right-0 h-1 bg-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.8)] animate-[scan_4s_linear_infinite] pointer-events-none z-50" />
);

const Typewriter: React.FC<{ text: string | React.ReactNode; delay?: number; speed?: number }> = ({ text, delay = 0, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  const fullText = typeof text === 'string' ? text : "";

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started || !fullText) return;
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, fullText, speed, started]);

  if (typeof text !== 'string') return <>{text}</>;
  return <span>{displayedText}<span className="animate-pulse">|</span></span>;
};

const GlobalGate: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const location = useLocation();

  const isGatePage = location.pathname === '/gate';

  useEffect(() => {
    if (enabled && !isGatePage) {
      setCaptchaCode(generateCaptcha());
      setIsUnlocked(false);
      setHoldProgress(0);
      setUserInput("");
    }
  }, [enabled, isGatePage]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && !isUnlocked && userInput.toUpperCase() === captchaCode) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            setIsUnlocked(true);
            setIsHolding(false);
            return 100;
          }
          return prev + 0.6;
        });
      }, 30);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, isUnlocked, userInput, captchaCode]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_config', 'gate'), (doc) => {
      if (doc.exists()) {
        setEnabled(doc.data().enabled || false);
      }
    });
    return () => unsub();
  }, []);

  if (!enabled || isGatePage) return null;

  return (
    <AlertDialog open={enabled}>
      <AlertDialogContent className="max-w-[95vw] md:max-w-4xl bg-black/95 backdrop-blur-3xl border-2 border-primary/30 shadow-[0_0_120px_-20px_rgba(var(--primary),0.5)] transition-all duration-1000 p-0 overflow-hidden rounded-[3rem] ring-1 ring-white/10">
        <style dangerouslySetInnerHTML={{ __html: HUD_STYLES }} />
        <ScanningLine />
        
        <div className="absolute inset-0 bg-primary/5 hud-grid pointer-events-none opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-primary/20 rounded-full blur-xl animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        <ScrollArea className="max-h-[95vh] w-full">
          <div className="relative p-6 md:p-10 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/40 blur-[100px] rounded-full animate-pulse group-hover:bg-primary/60 transition-colors" />
              <div className="relative h-24 w-24 md:h-28 md:w-28 bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-700 hover:scale-110 active:scale-95">
                <Lock className="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg" />
              </div>
              <div className="absolute -top-3 -right-3 h-10 w-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg animate-bounce border-2 border-primary/20">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <AlertDialogHeader className="items-center text-center space-y-3 md:space-y-4">
              <AlertDialogTitle className="text-4xl md:text-6xl font-black tracking-tighter text-foreground drop-shadow-2xl flex flex-col items-center">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Hello Jothilingam
                </span>
                <span className="text-primary flex items-center gap-3 mt-1">
                  <span className="text-2xl md:text-3xl opacity-50">&</span> 
                  JL Team
                </span>
              </AlertDialogTitle>
              
              {!isUnlocked ? (
                <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="hud-card group p-5 rounded-3xl overflow-hidden">
                    <HUDCorner className="top-0 left-0 border-t border-l" />
                    <HUDCorner className="top-0 right-0 border-t border-r" />
                    <HUDCorner className="bottom-0 left-0 border-b border-l" />
                    <HUDCorner className="bottom-0 right-0 border-b border-r" />
                    
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                        <Keyboard className="h-3 w-3" /> System: Verify Identity
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-mono text-primary/40 uppercase hidden md:inline">Key: RSA-4096</span>
                        <div className="flex gap-1 px-3 py-1 bg-primary/10 rounded-full italic select-none shadow-inner">
                          {captchaCode.split('').map((char, i) => (
                            <span 
                              key={i} 
                              className="text-sm font-mono font-black text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                              style={{ 
                                transform: `rotate(${Math.sin(i * 10) * 15}deg) translateY(${Math.cos(i * 10) * 2}px)`,
                                display: 'inline-block'
                              }}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Input
                      placeholder="ACCESS CODE"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                      className="h-14 bg-black/60 border-primary/30 text-center text-2xl font-black font-mono tracking-[0.6em] focus:ring-2 focus:ring-primary/40 focus:border-primary/60 focus:bg-primary/5 rounded-2xl placeholder:text-primary/10 placeholder:font-black transition-all duration-500 shadow-inner group-hover:border-primary/50 group-hover:shadow-[0_0_20px_-10px_rgba(var(--primary),0.3)]"
                      maxLength={CAPTCHA_LENGTH}
                    />
                  </div>

                  <div className="hud-card p-5 rounded-3xl overflow-hidden">
                    <HUDCorner className="top-0 left-0 border-t border-l opacity-40" />
                    <HUDCorner className="bottom-0 right-0 border-b border-r opacity-40" />
                    
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-2">
                        <Fingerprint className="h-3 w-3" /> Bio: Sync Status
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-[8px] font-mono text-primary/40 uppercase hidden md:inline">Buffer: 4.2GB</span>
                        <span className="text-[10px] font-black font-mono text-primary animate-pulse">{Math.round(holdProgress)}%</span>
                      </div>
                    </div>
                    
                    <div className="relative group/hold transition-all duration-500">
                      <div className="absolute -inset-1 bg-primary/10 blur-xl rounded-full opacity-0 group-hover/hold:opacity-100 transition-opacity" />
                      <Progress value={holdProgress} className="h-16 bg-black/60 border border-primary/20 rounded-2xl overflow-hidden shadow-inner" />
                      <Button
                        onMouseDown={() => setIsHolding(true)}
                        onMouseUp={() => setIsHolding(false)}
                        onMouseLeave={() => setIsHolding(false)}
                        onTouchStart={() => setIsHolding(true)}
                        onTouchEnd={() => setIsHolding(false)}
                        disabled={userInput.toUpperCase() !== captchaCode}
                        className={`absolute inset-0 w-full h-full bg-transparent hover:bg-primary/5 active:bg-primary/10 transition-all rounded-2xl border-none text-foreground font-black tracking-[0.5em] uppercase text-xs ${userInput.toUpperCase() !== captchaCode ? 'cursor-not-allowed opacity-20 filter grayscale px-4' : 'cursor-pointer text-primary shadow-[0_0_15px_-5px_rgba(var(--primary),0.5)] animate-pulse'}`}
                      >
                        {userInput.toUpperCase() !== captchaCode ? 'SECURITY CHECK REQUIRED' : isHolding ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                            SYNCING DATA...
                          </span>
                        ) : 'HOLD TO VERIFY'}
                      </Button>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center px-2">
                       <div className="flex gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className={`h-1 w-8 rounded-full ${holdProgress > (i + 1) * 25 ? 'bg-primary shadow-[0_0_5px_rgba(var(--primary),1)]' : 'bg-primary/10'}`} />
                          ))}
                       </div>
                       <span className="text-[8px] font-mono text-primary/30 uppercase tracking-widest">Link: Stable 99%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hud-card group p-10 md:p-16 rounded-[3rem] animate-in zoom-in slide-in-from-top-4 duration-1000 w-full success-glow border-primary/60 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 hud-grid animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-primary/20 rounded-full animate-[shockwave_2s_ease-out_infinite] border-2 border-primary/50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 w-1/2 bg-primary/10 rounded-full animate-[shockwave_3s_ease-out_infinite_1s] border border-primary/30" />
                  
                  <HUDCorner className="top-6 left-6 border-t-2 border-l-2 scale-150" />
                  <HUDCorner className="bottom-6 right-6 border-b-2 border-r-2 scale-150" />
                  
                  <div className="relative z-10 flex flex-col items-center space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-primary" />
                      <SuccessWaveforms />
                      <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-primary" />
                    </div>

                    <div className="relative">
                      <div className="absolute -top-12 -right-12 h-20 w-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-bounce border-4 border-black group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="h-10 w-10" />
                      </div>
                      <div className="space-y-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-black uppercase tracking-[0.6em] text-emerald-400 animate-pulse mb-2">Security Clearance : OMEGA</span>
                          <div className="h-px w-32 bg-primary/40 mb-6" />
                        </div>
                        <p className="text-4xl md:text-8xl font-black font-mono tracking-tighter text-primary drop-shadow-[0_0_40px_rgba(var(--primary),1)] flex items-center justify-center gap-6 md:gap-10 flex-wrap leading-none animate-[flicker-in_1.5s_ease-out]">
                          <span className="hover:scale-110 transition-transform duration-500">Jothilingam</span>
                          <span className="text-destructive animate-pulse text-5xl md:text-9xl drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">❤️</span>
                          <span className="text-foreground transition-all duration-1000 hover:scale-110">Vishalni</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                      <span>Node Status: Authorized</span>
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <span>Encrypted Link: Active</span>
                    </div>
                  </div>
                </div>
              )}

              <AlertDialogDescription className="text-lg md:text-2xl font-bold text-muted-foreground/80 max-w-xl leading-snug min-h-[4em] pt-4">
                <Typewriter 
                  text={
                    <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
                      Greetings from the teams at 
                      <span className="metallic-gold font-black drop-shadow-[0_0_8px_rgba(255,223,0,0.5)]">
                        JS Corporations
                      </span>
                      Vercel, Supabase, Firebase, and Claude.
                    </span>
                  } 
                  delay={1000} 
                />
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="p-6 bg-primary/10 border-2 border-primary/20 rounded-2xl w-full max-w-md backdrop-blur-md min-h-[5rem] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <p className="text-xl font-bold text-primary italic relative z-10">
                <Typewriter 
                  text='"We hope you are having a wonderful day!"' 
                  delay={4000} 
                />
              </p>
            </div>
            
            <div className="space-y-8 w-full pb-6 text-center">
              <div className="flex gap-2 items-center justify-center text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                Secure Protocol: Active Node
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 px-6 py-6 border-t border-primary/10 mt-4 relative">
                {[
                  { Icon: Triangle, label: "Vercel", color: "text-white" },
                  { Icon: Zap, label: "Supabase", color: "text-emerald-500" },
                  { Icon: Flame, label: "Firebase", color: "text-orange-500" },
                  { Icon: Bot, label: "Claude", color: "text-amber-200" }
                ].map((item, id) => (
                  <div key={id} className="flex flex-col items-center gap-3 group transition-all duration-500 hover:-translate-y-2">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 shadow-xl group-hover:border-primary/50 group-hover:shadow-primary/20 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-primary/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <item.Icon className={`h-5 w-5 md:h-6 md:w-6 ${item.color} opacity-40 group-hover:opacity-100 fill-current relative z-10`} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-500 flex items-center gap-1">
                      <ChevronRight className="h-2 w-2" /> {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalGate;
