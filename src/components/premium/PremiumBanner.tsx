import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent, AnalyticsEvents } from '@/lib/analytics';
import { usePremiumBanner } from '@/hooks/usePremiumBanner';
import { cn } from '@/lib/utils';

interface PremiumBannerProps {
  variant: 'floating-bottom' | 'inline' | 'post-completion';
  sourcePage: string;
  title: string;
  description: string;
  ctaText?: string;
  bannerId: string;
}

export function PremiumBanner({ variant, sourcePage, title, description, ctaText = "Upgrade to Premium", bannerId }: PremiumBannerProps) {
  const { isVisible, dismiss } = usePremiumBanner(bannerId);

  if (!isVisible) return null;

  const handleCtaClick = () => {
    trackEvent(AnalyticsEvents.PREMIUM_CTA_CLICK, {
      source_page: sourcePage,
      cta_location: variant,
      cta_text: ctaText,
      banner_variant: variant,
    });
  };

  const variants = {
    'floating-bottom': {
      container: "fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-50",
      content: "bg-background border border-border shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4"
    },
    'inline': {
      container: "w-full",
      content: "bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
    },
    'post-completion': {
      container: "w-full my-8",
      content: "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center"
    }
  };

  const selected = variants[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={selected.container}
      >
        <div className={cn(selected.content, "relative")}>
          <button onClick={dismiss} className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Crown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          <Button onClick={handleCtaClick} render={<Link href="/premium">{ctaText}</Link>} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold whitespace-nowrap" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
