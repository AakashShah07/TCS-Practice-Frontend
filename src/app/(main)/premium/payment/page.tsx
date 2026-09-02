"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api/client";

export default function PaymentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Access control
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.isPremium) {
        router.push("/premium");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.isPremium) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const upiId = "aakashshah0707@okicici"; // Placeholder UPI ID
  const productName = "CrackNQt Premium - Lifetime Access";
  const amount = 49;
  const orderId = `CNQ-${user?._id.slice(-6).toUpperCase() || "DEMO"}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // UTR Validation: No spaces, 12 alphanumeric characters
    const utrRegex = /^[a-zA-Z0-9]{12}$/;
    
    if (!utr) return toast.error("Please enter your UTR/Transaction ID");
    if (utr.includes(" ")) return toast.error("UTR cannot contain spaces");
    if (!utrRegex.test(utr)) return toast.error("UTR must be exactly 12 alphanumeric characters");

    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post("/payment/submit", {
        utr,
        productId: "premium-lifetime",
      });

      if (data) {
        toast.success("Payment submitted for verification!");
        router.push("/premium");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
      </div>

      <div className="grid gap-6">
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Crown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-amber-900 dark:text-amber-100">{productName}</h2>
                <p className="text-amber-700/80 dark:text-amber-300/80">Lifetime Access</p>
              </div>
            </div>
            <div className="flex justify-between text-sm border-t border-amber-200 dark:border-amber-800 pt-4">
              <span>Amount</span>
              <span className="font-bold">₹{amount}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Order ID</span>
              <span className="font-mono text-muted-foreground">{orderId}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-muted p-4 rounded-lg inline-block">
                {/* QR Code */}
                <Image
                  src="/images/myQR.jpeg"
                  alt="UPI QR Code"
                  width={160}
                  height={160}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground">Scan this QR using any UPI app</p>
            </div>

            <div className="space-y-2">
              <Label>UPI ID</Label>
              <div className="flex gap-2">
                <Input value={upiId} readOnly />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
              <div className="space-y-2">
                <Label htmlFor="utr">UTR / Transaction ID</Label>
                <Input
                  id="utr"
                  value={utr}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s/g, ""); // Remove spaces
                    if (val.length <= 12) setUtr(val);
                  }}
                  placeholder="Enter 12-digit UTR"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Payment for Verification"}
              </Button>
            </form>

            <div className="text-xs text-center text-muted-foreground pt-4 border-t">
              <p>🕐 Payment verification may take up to 24 hours.</p>
              <p>Your Premium access will be activated after verification.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
