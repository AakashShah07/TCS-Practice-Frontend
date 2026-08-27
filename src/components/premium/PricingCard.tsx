"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import apiClient from "@/lib/api/client";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export default function PricingCard() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const benefits = [
    "50 Mock Tests",
    "Coding Challenges",
    "Prime Prep",
    "AI Analytics",
    "Lifetime Updates",
  ];

  const handleUnlockPremium = async () => {
    if (!user) {
      toast.error("Please log in to upgrade.");
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.put(`/admin/users/${user._id}/premium`, {
        isPremium: true,
        subscriptionType: "monthly"
      });
      toast.success("Congratulations! You are now a premium member.");
      window.location.reload(); 
    } catch (error) {
      console.error("Premium upgrade error:", error);
      toast.error("Failed to upgrade to premium. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <motion.div 
             whileHover={{ scale: 1.02 }}
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="relative p-[1px] rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-2xl"
          >
            {/* shine effect */}
            <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            
            <div className="p-8 bg-background rounded-[23px] backdrop-blur-xl">
              <div className="text-center">
                <h2 className="text-4xl font-bold mt-2">Lifetime Access</h2>
                <div className="flex items-center justify-center gap-1 mt-6">
                  <span className="text-6xl font-bold">₹299</span>
                </div>
                <p className="text-muted-foreground mt-2">🔥 Only ₹0.81/day</p>
              </div>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={benefit} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={handleUnlockPremium}
                disabled={loading}
                className="w-full mt-8 h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold"
              >
                {loading ? "Processing..." : "Unlock Premium"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
