'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Login Form Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize browser Supabase client
  const supabase = createClient();

  // Redirect to /admin if session already exists
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/admin");
      }
    }
    checkSession();
  }, [router, supabase]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      const targetEmail = values.email === "admin@nexora.com" ? "admin@mobilestore.com" : values.email;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: values.password,
      });

      if (error) {
        console.error("Auth error response:", error);
        setAuthError(error.message);
        return;
      }

      if (data?.session) {
        router.replace("/admin");
      }
    } catch (err) {
      console.error("Unexpected authentication error:", err);
      setAuthError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 py-12 overflow-hidden select-none">
      
      {/* Background Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 size-[350px] sm:size-[500px] rounded-full bg-blue-300/10 dark:bg-blue-600/5 blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-20 size-[350px] sm:size-[500px] rounded-full bg-pink-300/10 dark:bg-pink-600/5 blur-3xl animate-blob animation-delay-2000" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animate-blob {
          animation: float 12s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 4s;
        }
      `}} />

      {/* Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      >
        {/* Logo and Headings */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-12 rounded-2xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center shadow-sm mb-4">
            <Smartphone className="size-6 stroke-[1.8]" />
          </div>
          <h1 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">
            Admin Portal
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Sign in with your Apple Admin credentials
          </p>
        </div>

        {/* Global Auth Error Banner */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 text-xs font-semibold flex items-start gap-2.5"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                id="email"
                type="email"
                placeholder="admin@nexora.com"
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300 transition-colors",
                  errors.email && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors pointer-events-none select-none"
                tabIndex={-1}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "w-full pl-10 pr-10 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300 transition-colors",
                  errors.password && "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                )}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-lg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Remember Me checkbox */}
          <div className="flex items-center gap-2 select-none">
            <input
              id="rememberMe"
              type="checkbox"
              className="size-4 rounded border-zinc-250 text-zinc-950 focus:ring-zinc-950 dark:border-zinc-800 cursor-pointer"
              {...register("rememberMe")}
            />
            <label htmlFor="rememberMe" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer">
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-zinc-400" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </div>

        </form>
      </motion.div>
    </main>
  );
}
