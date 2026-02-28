import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, LogIn, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginGate() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
          <p className="text-sm text-muted-foreground">
            Loading your tracker...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_20%,oklch(0.22_0.04_20)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_80%_80%,oklch(0.18_0.03_20)_0%,transparent_50%)]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-primary/5 opacity-60" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full border border-primary/5 opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_oklch(0.7_0.3_25/0.15)]">
              <GraduationCap size={36} className="text-primary" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-3"
          >
            <h1 className="font-display text-4xl font-bold text-foreground leading-tight">
              SSC CGL
            </h1>
            <h2 className="font-display text-2xl font-semibold text-primary mt-0.5">
              Ultimate Tracker
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto"
          >
            Your complete SSC CGL preparation companion — track habits, study
            hours, 9000 questions, and Pomodoro sessions, all synced to your
            secure account.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[
              { icon: <Target size={16} />, label: "15-Hour Plan" },
              { icon: <BookOpen size={16} />, label: "9000 Questions" },
              { icon: <Zap size={16} />, label: "Pomodoro Timer" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 border border-border"
              >
                <span className="text-primary">{f.icon}</span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {f.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Login button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base h-12 shadow-[0_4px_24px_oklch(0.7_0.3_25/0.3)] transition-shadow hover:shadow-[0_6px_32px_oklch(0.7_0.3_25/0.4)]"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login to Start Tracking
                </span>
              )}
            </Button>
            <p className="text-[11px] text-muted-foreground mt-3">
              Secured by Internet Identity · Your data is private and persists
              across sessions
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
