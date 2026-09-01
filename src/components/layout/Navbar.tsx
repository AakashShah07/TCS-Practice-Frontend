"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  BarChart3,
  Code2,
  Menu,
  LogOut,
  Crown,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tests", label: "Tests", icon: FileText },
  { href: "/practice", label: "Practice", icon: BookOpen },
  { href: "/coding", label: "Coding", icon: Code2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/premium", label: "Premium", icon: Crown },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60", user?.isPremium ? "border-amber-500/20 bg-background/95" : "bg-background/95")}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm", user?.isPremium ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white" : "bg-primary text-primary-foreground")}>
              {user?.isPremium ? <Crown className="h-5 w-5" /> : "NQT"}
            </div>
            <span className={cn("hidden font-bold sm:inline-block", user?.isPremium && "text-amber-900 dark:text-amber-100")}>
              TCS NQT Prep
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isPremiumLink = link.href === "/premium";
              const isAnalyticsLink = link.href === "/analytics";
              const isLocked = isAnalyticsLink && !user?.isPremium;
              const Icon = isLocked ? Lock : link.icon;
              const isActive = pathname !== "/tcs-nqt-preparation" && pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? (isPremiumLink || (isAnalyticsLink && user?.isPremium)) ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100" : "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                    isPremiumLink && "text-amber-600 dark:text-amber-400 font-bold",
                    (isAnalyticsLink && user?.isPremium && isActive) && "text-amber-600 dark:text-amber-400 font-bold",
                    isLocked && "text-amber-600 dark:text-amber-400 font-bold"
                  )}
                >
                  <Icon className={cn("h-4 w-4", (isPremiumLink || isLocked || (isAnalyticsLink && user?.isPremium)) && "text-amber-500")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="relative h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-accent cursor-pointer"
              >
                <Avatar className={cn("h-8 w-8", user?.isPremium && "ring-2 ring-amber-400")}>
                  <AvatarFallback className={cn("text-xs font-bold", user?.isPremium && "text-amber-600 bg-amber-100")}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className={cn("font-medium", user?.isPremium && "text-amber-600")}>{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                {user?.isPremium && (
                  <div className="px-2 py-1 text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Crown className="h-3 w-3" /> PREMIUM
                  </div>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" render={<Link href="/login" />}>Log in</Button>
              <Button render={<Link href="/register" />}>Sign up</Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-lg h-8 w-8 hover:bg-accent cursor-pointer">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => {
                  const isPremiumLink = link.href === "/premium";
                  const isAnalyticsLink = link.href === "/analytics";
                  const isLocked = isAnalyticsLink && !user?.isPremium;
                  const Icon = isLocked ? Lock : link.icon;
                  const isActive = pathname !== "/tcs-nqt-preparation" && pathname.startsWith(link.href);
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        (isPremiumLink || isLocked) && "text-amber-500 hover:text-amber-600"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
