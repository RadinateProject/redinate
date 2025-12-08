'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  signInSchema,
  type SignInFormValues,
} from "@/lib/validations/auth.schemas";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Demo credentials
const DEMO_EMAIL = "info@radinate.com";
const DEMO_PASSWORD = "Radinate@001";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authError = searchParams.get("error");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (authError) {
      const errorMessages: Record<string, string> = {
        google_auth_cancelled: "Google sign-in was cancelled",
        google_auth_failed: "Google authentication failed",
        microsoft_auth_cancelled: "Microsoft sign-in was cancelled",
        microsoft_auth_failed: "Microsoft authentication failed",
      };
      toast({
        title: "Failed",
        description: errorMessages[authError] || "Authentication failed...",
        variant: "destructive",
      });
    }
  }, [authError]);

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check demo credentials
      if (data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
        // Store user data in localStorage
        const userData = {
          email: data.email,
          name: 'Demo User',
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Set authentication cookie
        document.cookie = `auth-token=authenticated; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        toast({
          title: "Success",
          description: "Welcome back! Redirecting to dashboard...",
          variant: "default",
        });

        // Small delay to show toast
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to home page and refresh
        router.push("/governance");
        router.refresh();
      } else {
        toast({
          title: "Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast({
        title: "Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen py-4">
      <Card className="mx-auto w-96 rounded-2xl border-0 bg-accent">
        <CardHeader className="text-center pb-2 space-y-0.5">
          <div className="inline-flex items-center gap-2 mb-0 justify-center pr-3">
            <img
              src="/logos/radinate__simple.png"
              alt="Radinate logo"
              className="h-18 w-22"
            />
          </div>
          <CardTitle className="text-2xl font-bold pt-0.5 mt-3">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs pt-0">
            Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email Address"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 font-semibold text-sm mt-1"
                  disabled={isLoading}
                >
                  {isLoading ? (  
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}   