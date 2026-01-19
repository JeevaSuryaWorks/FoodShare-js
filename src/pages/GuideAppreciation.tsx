import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '../components/Footer';
import { Heart, Star, Award, Zap, Code2, Globe, Sparkles, GraduationCap, Crown, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Enhanced Confetti Component
const Confetti = () => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; rotation: number; shape: 'circle' | 'square' | 'ribbon'; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#A78BFA', '#F472B6'];
        const shapes: ('circle' | 'square' | 'ribbon')[] = ['circle', 'square', 'ribbon'];
        const newParticles = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -20 - Math.random() * 50,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 4 + Math.random() * 6,
            rotation: Math.random() * 360,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            delay: Math.random() * 4,
            duration: 4 + Math.random() * 3
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[100]">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={`absolute animate-fall ${p.shape === 'circle' ? 'rounded-full' : p.shape === 'ribbon' ? 'w-1 h-4' : 'rounded-sm'}`}
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: p.shape === 'ribbon' ? `${p.size * 2}px` : `${p.size}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `confetti-fall ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                        animationDelay: `${p.delay}s`,
                        boxShadow: `0 0 10px ${p.color}40`,
                    }}
                />
            ))}
        </div>
    );
};

const GuideAppreciation = () => {
    const [active, setActive] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => setActive(true), 100);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle parallax effect
        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;

        setMousePosition({ x: rotateY, y: rotateX });
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-yellow-500/30 flex flex-col">
            {/* CSS for animations */}
            <style>{`
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .glass-card {
                background: rgba(255, 255, 255, 0.03);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            }
            .elite-border {
                position: relative;
                z-index: 1;
            }
            .elite-border::before {
                content: '';
                position: absolute;
                inset: -2px;
                background: linear-gradient(45deg, #FFD700, #FFA500, #FF4500, #FFD700);
                background-size: 400%;
                z-index: -1;
                animation: shimmer 10s linear infinite;
                border-radius: inherit;
                filter: blur(5px);
                opacity: 0.3;
            }
        `}</style>

            {/* Dark Ambient Background */}
            <div className="absolute inset-0 bg-[#020617]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-black opacity-80" />
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl" />

            {/* Aurora Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[100px] animate-pulse-slow delay-1000" />

            {active && <Confetti />}

            <Navbar />

            <main className="flex-1 relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center">

                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
                    className={`w-full max-w-6xl transition-all duration-1000 ease-out transform ${active ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                    style={{
                        perspective: '1000px',
                    }}
                >
                    <div
                        className="transition-transform duration-200 ease-out"
                        style={{
                            transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
                        }}
                    >
                        {/* Header Title */}
                        <div className="text-center mb-16 space-y-4">
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/5 px-4 py-1.5 text-xs tracking-[0.2em] font-bold uppercase backdrop-blur-md">
                                Project Leadership
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight text-white drop-shadow-lg">
                                Guidance & Mentorship
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto opacity-50" />
                        </div>

                        {/* Dual Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">

                            {/* Mentor 1: Mrs. Predeepa */}
                            <Card className="glass-card elite-border border-none rounded-[2.5rem] transition-all duration-500 hover:-translate-y-4 group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
                                <CardContent className="p-10 text-center relative z-10">
                                    <div className="mb-8 relative inline-flex">
                                        <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative p-6 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-purple-900/40 ring-1 ring-purple-500/50">
                                            <Crown className="h-12 w-12 text-purple-400 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-display">Mrs. M. Predeepa</h2>
                                    <p className="text-purple-400 font-mono text-sm font-bold tracking-[0.3em] mb-4 uppercase">M.E.</p>
                                    <Badge className="bg-purple-500 text-white hover:bg-purple-600 px-6 py-1.5 rounded-full text-xs font-black shadow-lg shadow-purple-500/20 mb-8 border-none uppercase tracking-widest">
                                        The Leading Visionary
                                    </Badge>
                                    <p className="text-slate-400 italic text-base leading-relaxed max-w-xs mx-auto">
                                        "The visionary who helped us navigate complexities and inspired us to strive for excellence."
                                    </p>
                                </CardContent>
                                <div className="h-2 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                            </Card>

                            {/* Mentor 2: Mr. Ashok Kumar */}
                            <Card className="glass-card rounded-[2.5rem] border-zinc-800/50 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-4 group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/0 group-hover:bg-emerald-500/10 blur-3xl rounded-full transition-colors" />
                                <CardContent className="p-10 text-center relative z-10">
                                    <div className="mb-8 relative inline-flex">
                                        <div className="relative p-6 rounded-[2rem] bg-zinc-900/60 ring-1 ring-zinc-700 group-hover:ring-emerald-500/50 transition-all">
                                            <Target className="h-12 w-12 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-display">Mr.K. Ashok Kumar</h2>
                                    <p className="text-emerald-400 font-mono text-sm font-bold tracking-[0.3em] mb-4 uppercase">B.E.</p>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-6 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-widest">
                                        Core Project Incharge
                                    </Badge>
                                    <p className="text-slate-400 italic text-base leading-relaxed max-w-xs mx-auto">
                                        "The pillar of support who ensured our project remained on track with technical precision."
                                    </p>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Common Gratitude Section */}
                        <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="flex justify-center mb-6">
                                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                            </div>

                            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-8">
                                Your combined guidance has been instrumental in the development of
                                <span className="text-white font-bold px-2">FeedReach [Food Waste Management System].</span>
                                Thank you for fostering an environment of learning and innovation.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Code2 className="h-5 w-5 text-blue-400" />
                                    <span className="text-sm">Technical Support</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                                    <span className="text-sm">Innovative Ideas</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Globe className="h-5 w-5 text-emerald-400" />
                                    <span className="text-sm">Social Impact</span>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Presented By</p>
                                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                        The Development Team
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/5">
                                        <GraduationCap className="h-3 w-3 text-yellow-500" />
                                        <span className="text-xs text-slate-400 font-mono">
                                            Powered by <span className="text-white font-semibold">JS Corporations</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center pb-8">
                            <Button variant="ghost" className="text-slate-500 hover:text-white rounded-full" asChild>
                                <Link to="/">Back to Home</Link>
                            </Button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GuideAppreciation;
