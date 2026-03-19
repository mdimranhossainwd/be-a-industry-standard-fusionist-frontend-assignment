"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { authService } from "@/services/authService";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // ── Cooldown timer ────────────────────────────────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // ── OTP input handlers ────────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    setIsVerifying(true);
    try {
      // await authService.verifyEmail({ email, code });
      toast.success("Email verified! Redirecting...");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid or expired code. Please try again.";
      toast.error(message);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend ────────────────────────────────────────────────────
  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      // await authService.resendVerificationEmail(email);
      toast.success("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
              <MailCheck className="h-7 w-7 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            We sent a 6-digit code to{" "}
            {email ? (
              <span className="font-medium text-gray-800">{email}</span>
            ) : (
              "your email address"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP inputs */}
          <div className="space-y-2">
            <Label>Verification code</Label>
            <div className="flex gap-2 justify-between">
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <Input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className="h-12 w-full text-center text-lg font-semibold tracking-widest"
                />
              ))}
            </div>
          </div>

          {/* Resend */}
          <div className="text-center text-sm text-gray-600">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Resend in {cooldown}s
                </>
              ) : (
                "Resend code"
              )}
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 cursor-pointer"
            disabled={isVerifying || !isComplete}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Wrong email?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Go back
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
