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
import { Lock, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const V_NAMES = [
  "Vaidehi", "Vaishnavi", "Vanya", "Vanshika", "Vedika", "Vidya", "Vimala", "Vineeta", "Vinita", "Vinaya", 
  "Vipasha", "Vishwa", "Vividha", "Vrinda", "Vyomini", "Vatsala", "Vagdevi", "Vahini", "Vaijayanti", "Vaishali",
  "Vallari", "Vanamala", "Vandana", "Vanita", "Varada", "Varsha", "Vasudha", "Vasumathi", "Veda", "Vedanti",
  "Veena", "Venuka", "Vibha", "Vibhuti", "Vidisha", "Vidula", "Vidyut", "Vihari", "Vijaya", "Vinati",
  "Vinoda", "Vipula", "Viraja", "Vishakha", "Vishalakshi", "Vishaya", "Vishoka", "Vishruthi", "Vismaya", "Vita",
  "Vitola", "Viveka", "Vraja", "Vratika", "Vritti", "Vrushali", "Vyjayanthi", "Vandita", "Vanhishikha", "Vaniksha",
  "Vasanta", "Velini", "Vennela", "Vetali", "Viana", "Vibhi", "Vidita", "Vigna", "Viharika", "Vilasini",
  "Vinamra", "Vindhya", "Vinisha", "Vira", "Visala", "Viti", "Viya", "Viyona", "Vrandavani", "Vrushti",
  "Vagisha", "Vajreshwari", "Vamakshi", "Vanditha", "Vanisri", "Varuni", "Vasumati", "Vayuna", "Vedasri", "Veenapani",
  "Velasen", "Venkatalakshmi", "Vibhusha", "Vidura", "Vidyasri", "Vigra", "Vijeta", "Vimalini", "Vimudha", "Vinaya",
  "Vaiga", "Vanathi", "Valarmathi", "Valli", "Vedhavalli", "Vennila", "Vinothini", "Vasanthi", "Varshini", "Vanitha",
  "Vishaka", "Vishnupriya", "Vidhya", "Valliammal", "Vasanthamani", "Velmani", "Veeralakshmi", "Vijayalakshmi", "Vetriselvi", "Vanamail"
];

const GlobalGate: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [vName, setVName] = useState(V_NAMES[0]);
  const location = useLocation();

  const isGatePage = location.pathname === '/gate';

  useEffect(() => {
    if (!enabled || isGatePage) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % V_NAMES.length;
      setVName(V_NAMES[index]);
    }, 3000); // Slower shuffle for readability (3 seconds)

    return () => clearInterval(interval);
  }, [enabled, isGatePage]);

  useEffect(() => {
    // Listen to the gate status in Firestore
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
      <AlertDialogContent className="max-w-[90vw] md:max-w-2xl max-h-[95vh] overflow-y-auto bg-background/90 backdrop-blur-3xl border-2 border-primary/20 shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] shadow-primary/30 animate-in fade-in zoom-in duration-700 p-0 overflow-hidden rounded-[2.5rem]">
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
        
        <div className="relative p-8 md:p-12 flex flex-col items-center text-center space-y-6 md:space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full animate-pulse" />
            <div className="relative h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-700 hover:scale-110">
              <Lock className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <div className="absolute -top-4 -right-4 h-10 w-10 md:h-12 md:w-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          </div>

          <AlertDialogHeader className="items-center text-center space-y-4 md:space-y-6">
            <AlertDialogTitle className="text-4xl md:text-7xl font-black tracking-tighter text-foreground drop-shadow-2xl flex flex-col items-center">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Hello Jothilingam
              </span>
              <span className="text-primary flex items-center gap-4 mt-1 md:mt-2">
                <span className="text-3xl md:text-4xl opacity-50">&</span> 
                JL Team
              </span>
            </AlertDialogTitle>
            
            <div className="bg-foreground/5 p-3 md:p-4 rounded-2xl border border-foreground/10 backdrop-blur-md animate-pulse w-full">
              <p className="text-2xl md:text-4xl font-black font-mono tracking-widest text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                Jothilingam <span className="text-destructive animate-pulse">❤️</span> <span className="text-foreground">{vName}</span>
              </p>
            </div>

            <AlertDialogDescription className="text-xl md:text-3xl font-bold text-muted-foreground max-w-xl leading-snug">
              How are You from JS Corporations and Vercel Inc
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="p-6 bg-primary/10 border-2 border-primary/20 rounded-2xl w-full max-w-md backdrop-blur-md">
            <p className="text-xl font-bold text-primary italic">
              "Hope you're having a wonderful day! 👋"
            </p>
          </div>
          
          <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-[0.2em] text-primary/40">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            Secure Global Protocol Active
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalGate;
