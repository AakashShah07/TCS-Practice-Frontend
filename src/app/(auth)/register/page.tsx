"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { register } from "@/lib/api/auth";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Loader2, User, BookOpen, Code, Target } from "lucide-react";
import AuthParticles from "@/components/auth/AuthParticles";

export default function RegisterPage() {
  const router = useRouter();
  const { login: storeLogin } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [cardTransform, setCardTransform] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTransform(`perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale3d(1.02,1.02,1.02)`);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setCardTransform("");
  }, []);

  function validateName(value: string) {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  }

  function validateEmail(value: string) {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
    return "";
  }

  function validatePassword(value: string) {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  function getPasswordStrength(value: string): { label: string; width: string; color: string } {
    if (!value) return { label: "", width: "0%", color: "" };
    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 1) return { label: "Weak", width: "20%", color: "bg-red-400" };
    if (score <= 2) return { label: "Fair", width: "40%", color: "bg-orange-400" };
    if (score <= 3) return { label: "Good", width: "65%", color: "bg-yellow-400" };
    if (score <= 4) return { label: "Strong", width: "85%", color: "bg-emerald-400" };
    return { label: "Very strong", width: "100%", color: "bg-emerald-500" };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    if (nErr || eErr || pErr) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await register(name, email, password);
      storeLogin(response.data, response.accessToken, response.refreshToken);
      toast.success("Account created! Welcome!");
      router.push("/dashboard");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-12 px-4 pl-11 rounded-xl border bg-white dark:bg-gray-800 text-sm text-[#111827] dark:text-white outline-none transition-colors duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500";
  const inputNormal = "border-gray-200 dark:border-gray-700 focus:border-[#2563EB] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#2563EB]/20";
  const inputErrorStyle = "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

  const strength = getPasswordStrength(password);

  return (
    <>
      {/* ── Left blue panel (desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] relative overflow-hidden">
        <AuthParticles variant="blue" />
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl auth-bg-glow" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/8 blur-3xl auth-bg-glow-2" />
        <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full bg-blue-300/10 blur-3xl auth-bg-glow" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 w-full flex flex-col items-center justify-center px-12 auth-fade-up">
          <div className="w-full max-w-[360px] auth-float-slow">
            <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-lg">
              <rect x="80" y="200" width="240" height="12" rx="6" fill="rgba(255,255,255,0.15)" />
              <rect x="130" y="212" width="12" height="60" rx="2" fill="rgba(255,255,255,0.1)" />
              <rect x="258" y="212" width="12" height="60" rx="2" fill="rgba(255,255,255,0.1)" />
              <rect x="120" y="80" width="160" height="110" rx="8" fill="rgba(255,255,255,0.2)" />
              <rect x="128" y="88" width="144" height="90" rx="4" fill="rgba(255,255,255,0.08)" />
              <rect x="185" y="190" width="30" height="12" rx="2" fill="rgba(255,255,255,0.12)" />
              <rect x="145" y="100" width="8" height="8" rx="2" fill="#34D399" />
              <path d="M147 104L149 106L153 102" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="160" y="101" width="55" height="5" rx="2" fill="rgba(255,255,255,0.45)" />
              <rect x="145" y="116" width="8" height="8" rx="2" fill="#34D399" />
              <path d="M147 120L149 122L153 118" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="160" y="117" width="70" height="5" rx="2" fill="rgba(255,255,255,0.35)" />
              <rect x="145" y="132" width="8" height="8" rx="2" fill="#34D399" />
              <path d="M147 136L149 138L153 134" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="160" y="133" width="40" height="5" rx="2" fill="rgba(255,255,255,0.4)" />
              <rect x="145" y="148" width="8" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="160" y="149" width="60" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="145" y="164" width="8" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="160" y="165" width="45" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
              <circle cx="260" cy="108" r="14" fill="#FBBF24" />
              <path d="M260 100L262 106H268L263 109L265 115L260 112L255 115L257 109L252 106H258Z" fill="white" />
              <rect x="290" y="174" width="40" height="28" rx="3" fill="rgba(255,255,255,0.25)" />
              <rect x="295" y="179" width="20" height="3" rx="1" fill="rgba(255,255,255,0.5)" />
              <rect x="295" y="185" width="28" height="3" rx="1" fill="rgba(255,255,255,0.35)" />
              <rect x="295" y="191" width="15" height="3" rx="1" fill="rgba(255,255,255,0.4)" />
              <rect x="80" y="186" width="18" height="16" rx="3" fill="rgba(255,255,255,0.15)" />
              <path d="M89 186C89 180 85 176 89 172" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="89" cy="170" r="5" fill="#34D399" opacity="0.5" />
              <circle cx="60" cy="100" r="8" fill="rgba(255,255,255,0.2)" className="auth-particle-1" />
              <circle cx="340" cy="130" r="6" fill="rgba(255,255,255,0.15)" className="auth-particle-2" />
              <circle cx="50" cy="180" r="5" fill="rgba(255,255,255,0.18)" className="auth-particle-3" />
              <circle cx="320" cy="80" r="4" fill="rgba(255,255,255,0.12)" className="auth-particle-4" />
              <path d="M325 170L335 175L325 180" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" fill="none" className="auth-particle-2" />
            </svg>
          </div>

          <h2 className="text-white text-2xl font-bold text-center mt-8 auth-fade-up auth-delay-200">
            Start your journey today
          </h2>
          <p className="text-blue-100 text-sm text-center mt-2 auth-fade-up auth-delay-300">
            Join thousands of students preparing for TCS NQT
          </p>

          <div className="mt-10 space-y-4 w-full max-w-[300px]">
            <div className="flex items-center gap-3 auth-fade-up auth-delay-400">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90">Comprehensive exam preparation</span>
            </div>
            <div className="flex items-center gap-3 auth-fade-up auth-delay-500">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm">
                <Code className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90">Real exam simulation environment</span>
            </div>
            <div className="flex items-center gap-3 auth-fade-up auth-delay-600">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm">
                <Target className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white/90">Smart analytics & recommendations</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-10 auth-fade-up auth-delay-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block auth-badge-dot" />
              No Ads
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/90">
              <span className="w-2 h-2 rounded-full bg-blue-300 inline-block auth-badge-dot-2" />
              100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/90">
              <span className="w-2 h-2 rounded-full bg-violet-300 inline-block auth-badge-dot-3" />
              Student Focused
            </span>
          </div>
        </div>
      </div>

      {/* ── Right white panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 bg-[#F9FAFB] dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-blue-950/20 dark:to-gray-950" />
        <AuthParticles variant="subtle" />
        <div className="absolute top-[-20%] right-[-15%] w-[300px] h-[300px] rounded-full bg-blue-50/40 dark:bg-blue-950/30 blur-3xl auth-bg-glow-2" />

        <div className="relative z-10 w-full max-w-[420px]">
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="auth-fade-up auth-delay-100 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] border border-white/60 dark:border-gray-800 p-8 sm:p-10 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_20px_60px_rgb(37,99,235,0.12)] dark:hover:shadow-[0_20px_60px_rgb(99,102,241,0.15)]"
            style={{ transform: cardTransform || undefined }}
          >
            {/* Logo */}
            <div className="flex items-center justify-center mb-6 auth-fade-up auth-delay-200">
              <div className="flex items-center gap-2.5">
                <Image src="/llog.png" alt="NQT Prep logo" width={40} height={40} className="rounded-xl shadow-md shadow-blue-500/20" />
                <div>
                  <h1 className="text-lg font-bold text-[#111827] dark:text-white leading-none">NQT Prep</h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">by TCS</p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8 auth-fade-up auth-delay-300">
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white tracking-tight">Create your account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Start your TCS NQT preparation journey</p>
            </div>

            {/* Register form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name field */}
              <div className="space-y-1.5 auth-fade-up auth-delay-400">
                <label htmlFor="name" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameTouched) setNameError(validateName(e.target.value));
                    }}
                    onBlur={() => {
                      setNameTouched(true);
                      setNameError(validateName(name));
                    }}
                    placeholder="John Doe"
                    aria-label="Full name"
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "name-error" : undefined}
                    className={`${inputClass} ${nameError && nameTouched ? inputErrorStyle : inputNormal}`}
                    required
                  />
                </div>
                {nameError && nameTouched && (
                  <p id="name-error" className="text-xs text-red-500 dark:text-red-400 ml-1" role="alert">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-1.5 auth-fade-up auth-delay-500">
                <label htmlFor="email" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailTouched) setEmailError(validateEmail(e.target.value));
                    }}
                    onBlur={() => {
                      setEmailTouched(true);
                      setEmailError(validateEmail(email));
                    }}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className={`${inputClass} ${emailError && emailTouched ? inputErrorStyle : inputNormal}`}
                    required
                  />
                </div>
                {emailError && emailTouched && (
                  <p id="email-error" className="text-xs text-red-500 dark:text-red-400 ml-1" role="alert">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-1.5 auth-fade-up auth-delay-600">
                <label htmlFor="password" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordTouched) setPasswordError(validatePassword(e.target.value));
                    }}
                    onBlur={() => {
                      setPasswordTouched(true);
                      setPasswordError(validatePassword(password));
                    }}
                    placeholder="At least 6 characters"
                    aria-label="Password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className={`${inputClass} pr-11 ${passwordError && passwordTouched ? inputErrorStyle : inputNormal}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && passwordTouched && (
                  <p id="password-error" className="text-xs text-red-500 dark:text-red-400 ml-1" role="alert">
                    {passwordError}
                  </p>
                )}
                {/* Password strength meter */}
                {password && (
                  <div className="ml-1">
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="auth-fade-up auth-delay-700">
                <Button
                  type="submit"
                  disabled={loading}
                  className="auth-btn w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>

            {/* Terms note */}
            <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed auth-fade-up auth-delay-800">
              By creating an account, you agree to our{" "}
              <span className="text-gray-500 underline underline-offset-2 cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-gray-500 underline underline-offset-2 cursor-pointer">Privacy Policy</span>
            </p>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5 auth-fade-up auth-delay-800">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#2563EB] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Mobile-only tagline & badges */}
          <div className="lg:hidden">
            <p className="text-center text-sm text-gray-400 mt-5 font-medium auth-fade-up auth-delay-800">
              Crack TCS NQT with confidence — completely free, forever.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4 auth-fade-up auth-delay-900">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block auth-badge-dot" />
                No Ads
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block auth-badge-dot-2" />
                100% Free
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 text-xs font-semibold text-violet-700 dark:text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-500 inline-block auth-badge-dot-3" />
                Student Focused
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
