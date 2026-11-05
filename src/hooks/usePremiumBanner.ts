import { useState, useEffect } from 'react';

const BANNER_DISMISSAL_KEY = 'premium_banner_dismissed';

export function usePremiumBanner(bannerId: string, cooldownHours = 24) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(`${BANNER_DISMISSAL_KEY}_${bannerId}`);
    
    if (dismissedAt) {
      const now = Date.now();
      const cooldown = cooldownHours * 60 * 60 * 1000;
      if (now - parseInt(dismissedAt) < cooldown) {
        setIsVisible(false);
        return;
      }
    }
    
    // Default to visible if not dismissed or cooldown expired
    setIsVisible(true);
  }, [bannerId, cooldownHours]);

  const dismiss = () => {
    localStorage.setItem(`${BANNER_DISMISSAL_KEY}_${bannerId}`, Date.now().toString());
    setIsVisible(false);
  };

  return { isVisible, dismiss };
}
