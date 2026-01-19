import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Award, Star, ShieldCheck, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateSystemIntegrity } from '@/lib/identity';

interface CertificateProps {
    userName: string;
    milestone: string;
    date: string;
    type: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const DigitalCertificate: React.FC<CertificateProps> = ({ userName, milestone, date, type }) => {
    validateSystemIntegrity();

    interface CertificateStyle {
        bg: string;
        border: string;
        shadow: string;
        icon: React.ReactNode;
        tag: string;
        dark: boolean;
    }

    const styles: Record<string, CertificateStyle> = {
        bronze: {
            bg: 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100',
            border: 'border-amber-400/50',
            shadow: 'shadow-amber-500/20',
            icon: <Award className="h-12 w-12 text-amber-600" />,
            tag: 'Bronze Milestone',
            dark: false
        },
        silver: {
            bg: 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200',
            border: 'border-slate-400/50',
            shadow: 'shadow-slate-500/20',
            icon: <Star className="h-12 w-12 text-slate-500" />,
            tag: 'Silver Milestone',
            dark: false
        },
        gold: {
            bg: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-200',
            border: 'border-yellow-400/50',
            shadow: 'shadow-yellow-500/20',
            icon: <Trophy className="h-12 w-12 text-yellow-600" />,
            tag: 'Gold Milestone',
            dark: false
        },
        platinum: {
            bg: 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950',
            border: 'border-primary/50',
            shadow: 'shadow-primary/30',
            icon: <ShieldCheck className="h-12 w-12 text-primary" />,
            tag: 'ELITE PLATINUM',
            dark: true
        }
    };

    const style = styles[type];

    return (
        <Card className={`relative overflow-hidden w-full max-w-2xl mx-auto border-4 ${style.border} ${style.bg} ${style.shadow} transition-all duration-500 hover:scale-[1.02] group`}>
            {/* Decorative corners */}
            <div className={`absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 ${style.dark ? 'border-primary/30' : 'border-amber-600/20'}`} />
            <div className={`absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 ${style.dark ? 'border-primary/30' : 'border-amber-600/20'}`} />
            <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 ${style.dark ? 'border-primary/30' : 'border-amber-600/20'}`} />
            <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 ${style.dark ? 'border-primary/30' : 'border-amber-600/20'}`} />

            <CardContent className="p-12 text-center relative z-10">
                <div className="flex justify-center mb-6 animate-bounce-slow">
                    {style.icon}
                </div>

                <div className={`inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-8 ${style.dark ? 'bg-primary text-black' : 'bg-amber-600 text-white'}`}>
                    {style.tag}
                </div>

                <h2 className={`font-display text-lg tracking-widest uppercase mb-4 ${style.dark ? 'text-zinc-400' : 'text-amber-800/60'}`}>
                    Certificate of Appreciation
                </h2>

                <p className={`text-sm italic mb-8 ${style.dark ? 'text-zinc-500' : 'text-muted-foreground'}`}>
                    This is proudly presented to
                </p>

                <h3 className={`text-4xl md:text-5xl font-display font-black mb-8 tracking-tighter ${style.dark ? 'text-white' : 'text-foreground'}`}>
                    {userName}
                </h3>

                <div className={`w-24 h-1 mx-auto mb-8 ${style.dark ? 'bg-primary/50' : 'bg-amber-600/30'}`} />

                <p className={`max-w-md mx-auto leading-relaxed mb-10 ${style.dark ? 'text-zinc-300' : 'text-foreground/80'}`}>
                    In recognition of your outstanding contribution and commitment to the
                    <span className="font-bold"> {milestone} </span>
                    milestone in our mission to eliminate food waste and hunger.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-12 pt-8 border-t border-black/10">
                    <div className="text-left">
                        <p className={`text-xs uppercase tracking-widest font-bold ${style.dark ? 'text-zinc-500' : 'text-muted-foreground'}`}>Issued Date</p>
                        <p className={`font-mono text-sm ${style.dark ? 'text-zinc-300' : 'text-foreground'}`}>{date}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="h-12 w-32 border-b-2 border-primary/20 flex items-center justify-center italic text-primary/60 font-serif">
                            M. Predeepa
                        </div>
                        <p className="text-[10px] uppercase mt-2 opacity-50">Authorized Signature</p>
                    </div>

                    <div className="text-right">
                        <p className={`text-xs uppercase tracking-widest font-bold ${style.dark ? 'text-zinc-500' : 'text-muted-foreground'}`}>Category</p>
                        <p className={`font-mono text-sm ${style.dark ? 'text-zinc-300' : 'text-foreground'}`}>Impact Leader</p>
                    </div>
                </div>

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button className="gap-2 bg-white text-black hover:bg-zinc-200">
                        <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default DigitalCertificate;
