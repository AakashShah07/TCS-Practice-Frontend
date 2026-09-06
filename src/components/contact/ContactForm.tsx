"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("submitting")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus("success")
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="py-10 text-center sm:py-12"
                  >
                    <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                      Message Sent Successfully
                    </h3>

                    <p className="mx-auto max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                      Thanks for reaching out to CrackNQT. We&apos;ve received
                      your message and will review it as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>

                        <Input
                          id="name"
                          name="name"
                          required
                          autoComplete="name"
                          className="h-10 sm:h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>

                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="h-10 sm:h-11"
                        />
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Contact</Label>

                      <select
                        id="reason"
                        name="reason"
                        required
                        defaultValue=""
                        className="
                          flex h-10 w-full min-w-0 cursor-pointer
                          appearance-none rounded-lg
                          border border-input
                          bg-background
                          px-3 py-2
                          text-sm text-foreground
                          shadow-sm
                          outline-none
                          transition-colors
                          hover:bg-accent/30
                          focus-visible:border-ring
                          focus-visible:ring-2
                          focus-visible:ring-ring/30
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          dark:bg-background
                          dark:text-foreground
                          dark:hover:bg-accent/30
                          sm:h-11
                        "
                      >
                        <option
                          value=""
                          disabled
                          className="bg-background text-muted-foreground dark:bg-background dark:text-muted-foreground"
                        >
                          Select a reason
                        </option>

                        <option
                          value="general"
                          className="bg-background text-foreground dark:bg-background dark:text-foreground"
                        >
                          General Question
                        </option>

                        <option
                          value="technical"
                          className="bg-background text-foreground dark:bg-background dark:text-foreground"
                        >
                          Technical Issue
                        </option>

                        <option
                          value="content"
                          className="bg-background text-foreground dark:bg-background dark:text-foreground"
                        >
                          Content Feedback
                        </option>

                        <option
                          value="suggestion"
                          className="bg-background text-foreground dark:bg-background dark:text-foreground"
                        >
                          Suggestion
                        </option>

                        <option
                          value="premium"
                          className="bg-background text-foreground dark:bg-background dark:text-foreground"
                        >
                          Premium/Payment Support
                        </option>

                        <option
                          value="privacy"
                          className="bg-background text-foreground dark:bg-background dark:text-foreground"
                        >
                          Privacy Request
                        </option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="
                          flex min-h-[120px] w-full
                          resize-y rounded-lg
                          border border-input
                          bg-background
                          px-3 py-2
                          text-sm text-foreground
                          shadow-sm
                          outline-none
                          placeholder:text-muted-foreground
                          transition-colors
                          focus-visible:border-ring
                          focus-visible:ring-2
                          focus-visible:ring-ring/30
                          dark:bg-background
                          dark:text-foreground
                        "
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="h-10 w-full sm:h-11"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting"
                        ? "Sending..."
                        : "Send Message"}
                    </Button>

                    <p className="text-center text-xs leading-5 text-muted-foreground">
                      Never send passwords, OTPs, or card numbers through this
                      form.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}