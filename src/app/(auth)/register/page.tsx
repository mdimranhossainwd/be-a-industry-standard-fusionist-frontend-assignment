/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { registerAction } from "./_action";

const registerZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["MEMBER", "ADMIN"], { message: "Please select a role" }),
});

type RegisterFormData = z.infer<typeof registerZodSchema>;

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    },

    onSubmit: async ({ value }: { value: RegisterFormData }) => {
      setServerError(null);
      try {
        const result = (await registerAction(value)) as any;
        if (!result?.success) {
          setServerError(result?.message || "Registration failed");
        }
      } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
          throw error;
        }
        setServerError(`Registration failed: ${error.message}`);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Join EcoSpark and start your learning journey
          </CardDescription>
        </CardHeader>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardContent className="space-y-4">
            {/* Name */}
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="John Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field
              name="email"
              validators={{ onChange: registerZodSchema.shape.email }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="john@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Password */}
            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer mt-3"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </form.Subscribe>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
