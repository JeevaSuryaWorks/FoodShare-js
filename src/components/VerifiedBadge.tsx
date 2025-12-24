import React from 'react';
import { BadgeCheck } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const VerifiedBadge: React.FC<{ className?: string, showTooltip?: boolean }> = ({ className, showTooltip = true }) => {
    const badge = (
        <BadgeCheck
            className={`inline-block ml-1 text-blue-500 fill-blue-500/10 ${className}`}
            size={16}
            strokeWidth={2.5}
        />
    );

    if (!showTooltip) return badge;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help inline-flex items-center align-middle translate-y-[-1px]">{badge}</span>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">Verified Organization</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
