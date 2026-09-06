"use client"

export function PrivacyNotice() {
  return (
    <section className="py-8 bg-muted/20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          By submitting this form, you provide the information needed for CrackNQT to respond to your request.
        </p>
      </div>
    </section>
  )
}

export function ContactTrustSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Your Feedback Helps Us Improve</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          Your feedback helps us refine question quality, improve explanations, enhance website usability, and keep our exam resources practical and relevant.
        </p>
      </div>
    </section>
  )
}
