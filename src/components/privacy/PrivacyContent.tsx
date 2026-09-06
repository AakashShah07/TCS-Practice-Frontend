"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cookie,
  Database,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-information", label: "How We Use Information" },
  { id: "advertising-and-adsense", label: "Advertising & Google AdSense" },
  { id: "analytics", label: "Analytics" },
  { id: "data-sharing", label: "Data Sharing" },
  { id: "data-security", label: "Data Security" },
  { id: "your-privacy-rights", label: "Your Privacy Rights" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
]

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

export function PrivacyContent() {
  return (
    <section className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-24">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary sm:text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Your Privacy Matters</span>
          </div>

          {/* H1 */}
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg">
            Learn how CrackNQT collects, uses, protects, and manages your
            information while you use our TCS NQT preparation platform.
          </p>

          {/* Last updated */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur sm:text-sm">
            <FileText className="h-4 w-4" />
            <span>Last Updated: September 2026</span>
          </div>
        </motion.header>

        {/* TOP FEATURE CARDS */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Privacy First"
            description="We take reasonable measures to protect your information."
          />

          <FeatureCard
            icon={<Lock className="h-5 w-5" />}
            title="Secure Data"
            description="Your information is handled using reasonable security practices."
          />

          <FeatureCard
            icon={<Cookie className="h-5 w-5" />}
            title="Transparent Cookies"
            description="We explain how cookies and similar technologies are used."
          />
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          {/* DESKTOP TABLE OF CONTENTS */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 px-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  On this page
                </p>
              </div>

              <nav aria-label="Privacy Policy sections">
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs leading-5 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        <span>{section.label}</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* MOBILE TABLE OF CONTENTS */}
          <div className="lg:hidden">
            <details className="group rounded-2xl border border-border bg-card/70 shadow-sm backdrop-blur-xl">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Table of Contents
                </span>

                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>

              <nav
                aria-label="Privacy Policy sections"
                className="border-t border-border px-4 pb-4 pt-2"
              >
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </div>

          {/* POLICY ARTICLE */}
          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="min-w-0"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:rounded-3xl">
              <div className="p-5 sm:p-8 lg:p-10 xl:p-12">
                {/* Introduction */}
                <PolicySection
                  id="introduction"
                  number="01"
                  title="Introduction"
                  icon={<ShieldCheck className="h-5 w-5" />}
                >
                  <p>
                    At CrackNQT, we are committed to protecting your privacy
                    and ensuring you have a positive experience on our website.
                    This Privacy Policy explains how we collect, use, protect,
                    and manage information when you use our TCS NQT preparation
                    platform.
                  </p>
                </PolicySection>

                {/* Information We Collect */}
                <PolicySection
                  id="information-we-collect"
                  number="02"
                  title="Information We Collect"
                  icon={<Database className="h-5 w-5" />}
                >
                  <p>
                    We may collect information through information you
                    voluntarily provide and information automatically collected
                    when you use CrackNQT.
                  </p>

                  <div className="mt-6 space-y-5">
                    <SubSection title="A. Information You Voluntarily Provide">
                      <p>
                        This includes information you provide when using our
                        contact forms, such as your name, email address, the
                        subject of your request, and your message.
                      </p>
                    </SubSection>

                    <SubSection title="B. Automatically Collected Information">
                      <p>
                        When you visit CrackNQT, our systems may automatically
                        collect information about your visit, such as your IP
                        address, browser type, device information, pages
                        visited, and timestamps. This information helps us
                        understand how the website is used and improve your
                        experience.
                      </p>
                    </SubSection>

                    <SubSection title="C. Cookies and Similar Technologies">
                      <p>
                        We use cookies and similar technologies to enhance
                        functionality, analyze website traffic, and deliver
                        advertisements.
                      </p>
                    </SubSection>
                  </div>
                </PolicySection>

                {/* How We Use Information */}
                <PolicySection
                  id="how-we-use-information"
                  number="03"
                  title="How We Use Information"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                >
                  <p>We use the information we collect to:</p>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      "Provide and operate CrackNQT.",
                      "Respond to your contact and support requests.",
                      "Understand how visitors use our website and improve its functionality.",
                      "Prevent abuse and maintain the security of our platform.",
                      "Deliver relevant advertisements through third-party vendors.",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5 text-sm leading-6 text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </PolicySection>

                {/* Advertising */}
                <PolicySection
                  id="advertising-and-adsense"
                  number="04"
                  title="Advertising and Google AdSense"
                  icon={<Sparkles className="h-5 w-5" />}
                >
                  <p>
                    We use Google AdSense to serve advertisements on our
                    website. Google, as a third-party vendor, may use cookies
                    to serve ads based on your visits to our website and other
                    websites on the Internet.
                  </p>

                  <p>
                    You can opt out of personalized advertising by visiting{" "}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                    >
                      Google Ads Settings
                    </a>
                    . Third-party vendors and ad networks may also use cookies
                    to serve ads on our site.
                  </p>

                  <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                    <div className="flex gap-3">
                      <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                      <div>
                        <h3 className="font-semibold text-foreground">
                          About advertising cookies
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Advertising technologies may use cookies or similar
                          technologies to help deliver and measure
                          advertisements.
                        </p>
                      </div>
                    </div>
                  </div>
                </PolicySection>

                {/* Analytics */}
                <PolicySection
                  id="analytics"
                  number="05"
                  title="Analytics"
                  icon={<Sparkles className="h-5 w-5" />}
                >
                  <p>
                    We use Google Analytics to better understand how visitors
                    interact with our website. Google Analytics may collect
                    information such as IP address information and pages
                    visited to help us analyze website usage and improve our
                    content.
                  </p>

                  <p>
                    You can learn more about how Google processes information
                    by visiting Google&apos;s Privacy &amp; Terms.
                  </p>
                </PolicySection>

                {/* Data Sharing */}
                <PolicySection
                  id="data-sharing"
                  number="06"
                  title="Data Sharing"
                  icon={<Database className="h-5 w-5" />}
                >
                  <p>
                    We do not sell your personal information. We may share
                    information with trusted third-party service providers who
                    assist us in operating our website, such as hosting
                    providers and analytics providers, provided they agree to
                    keep this information secure.
                  </p>

                  <p>
                    We may also disclose information when required by law or
                    when reasonably necessary to protect the security and
                    integrity of our platform.
                  </p>
                </PolicySection>

                {/* Data Security */}
                <PolicySection
                  id="data-security"
                  number="07"
                  title="Data Security"
                  icon={<Lock className="h-5 w-5" />}
                >
                  <p>
                    We implement reasonable technical and organizational
                    measures to protect your information. However, please note
                    that no method of transmission over the Internet or storage
                    is completely secure.
                  </p>

                  <div className="mt-6 flex gap-3 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <p className="text-sm leading-6 text-muted-foreground">
                      While we work to protect your information, no online
                      service can guarantee absolute security.
                    </p>
                  </div>
                </PolicySection>

                {/* Privacy Rights */}
                <PolicySection
                  id="your-privacy-rights"
                  number="08"
                  title="Your Privacy Rights"
                  icon={<ShieldCheck className="h-5 w-5" />}
                >
                  <p>
                    Depending on your location, you may have certain rights
                    regarding your personal information, such as the right to
                    access, correct, or request the deletion of your data.
                  </p>

                  <p>
                    For privacy-related questions or requests, please contact
                    us through our Contact Us page.
                  </p>
                </PolicySection>

                {/* Changes */}
                <PolicySection
                  id="changes"
                  number="09"
                  title="Changes to This Privacy Policy"
                  icon={<FileText className="h-5 w-5" />}
                >
                  <p>
                    We may update this Privacy Policy from time to time to
                    reflect changes in our practices, services, or legal
                    requirements. When changes are made, we will post the
                    updated policy on this page along with an updated
                    &quot;Last Updated&quot; date.
                  </p>
                </PolicySection>

                {/* Contact */}
                <PolicySection
                  id="contact"
                  number="10"
                  title="Contact Us"
                  icon={<Mail className="h-5 w-5" />}
                  last
                >
                  <p>
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy, we&apos;re here to help.
                  </p>

                  {/* CONTACT CTA */}
                  <div className="relative mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 sm:p-7">
                    <div
                      aria-hidden="true"
                      className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                    />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="max-w-xl">
                        <div className="mb-2 flex items-center gap-2">
                          <Mail className="h-5 w-5 text-primary" />

                          <h3 className="text-lg font-semibold text-foreground">
                            Have a privacy question?
                          </h3>
                        </div>

                        <p className="text-sm leading-6 text-muted-foreground">
                          Contact the CrackNQT team and we&apos;ll be happy to
                          help with privacy-related questions or requests.
                        </p>
                      </div>

                      <Link
                        href="/contact"
                        className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        Contact Us
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </PolicySection>
              </div>

              {/* Bottom footer */}
              <div className="border-t border-border bg-muted/20 px-5 py-5 sm:px-8 lg:px-10">
                <p className="text-center text-xs leading-5 text-muted-foreground sm:text-sm">
                  Thank you for trusting CrackNQT with your learning journey.
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Feature Card                                                               */
/* -------------------------------------------------------------------------- */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      <h2 className="text-sm font-semibold text-foreground">{title}</h2>

      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Policy Section                                                             */
/* -------------------------------------------------------------------------- */

function PolicySection({
  id,
  number,
  title,
  icon,
  children,
  last = false,
}: {
  id: string
  number: string
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={!last ? "border-b border-border pb-10 sm:pb-12" : ""}
    >
      <div className={last ? "" : "mb-10"}>
        <div className="mb-5 flex items-start gap-3 sm:gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
              Section {number}
            </div>

            <h2
              id={`${id}-heading`}
              className="scroll-mt-24 text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="space-y-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {children}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Sub Section                                                                */
/* -------------------------------------------------------------------------- */

function SubSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
      <h3 className="mb-2 text-sm font-semibold text-foreground sm:text-base">
        {title}
      </h3>

      <div className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {children}
      </div>
    </div>
  )
}

