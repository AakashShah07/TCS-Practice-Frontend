"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import PremiumHero from "@/components/premium/PremiumHero";
import FeatureGrid from "@/components/premium/FeatureGrid";
import apiClient from "@/lib/api/client";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";

interface PremiumTest {
  _id: string;
  title: string;
  totalQuestions: number;
  duration: number;
}

export default function PremiumPage() {
  const { user } = useAuthStore();

  useEffect(() => {
    trackEvent(AnalyticsEvents.PREMIUM_PAGE_VIEW, { source_page: 'premium_page' });
  }, []);

  const [premiumTests, setPremiumTests] = useState<PremiumTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.isPremium) {
      setPremiumTests([]);
      setIsLoading(false);
      return;
    }

    const fetchPremiumTests = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get("/tests?isPremium=true");

        setPremiumTests(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch premium tests:", error);
        setPremiumTests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPremiumTests();
  }, [user?.isPremium]);

  return (
    <main className="container mx-auto py-10">
      {user?.isPremium ? (
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Your Premium Tests
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Access your exclusive premium mock tests.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse border-amber-100 bg-gray-100 dark:bg-gray-800">
                  <CardHeader>
                    <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : premiumTests.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-muted-foreground">
                No premium tests available yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {premiumTests.map((test) => (
                <Card
                  key={test._id}
                  className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-amber-900 dark:text-amber-100">
                      {test.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {test.totalQuestions} Questions
                      </Badge>

                      <Badge variant="outline">
                        {Math.round(test.duration / 60)} Minutes
                      </Badge>
                    </div>

                    <Button
                      className="bg-amber-600 hover:bg-amber-700"
                      render={<Link href={`/exam/${test._id}`} />}
                    >
                      Start Test
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Coming Soon Card */}
              <Card className="border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50 flex flex-col items-center justify-center p-8 text-center">
                <CardTitle className="text-lg text-gray-500 dark:text-gray-400">
                  More Tests Coming Soon
                </CardTitle>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-600">
                  We are working on adding more premium content. Stay tuned!
                </p>
              </Card>
            </div>
          )}
        </section>
      ) : (
        <>
          <PremiumHero />
          <FeatureGrid />
        </>
      )}
    </main>
  );
}