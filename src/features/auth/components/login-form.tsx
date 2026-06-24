"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthSocialButtons } from "@/features/auth/components/auth-social-buttons";
import { PasswordInput } from "@/features/auth/components/password-input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const signInGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
        callbackURL: "/workflows",
      },
      {
        onSuccess: () => {
          router.push("/workflows");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    );
  };

  const signInGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/workflows",
      },
      {
        onSuccess: () => {
          router.push("/workflows");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      },
    );
  };

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/workflows",
      },
      {
        onSuccess: () => {
          router.push("/workflows");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-8 lg:gap-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back — enter your credentials to continue.
        </p>
      </div>

      <AuthSocialButtons
        onGithub={signInGithub}
        onGoogle={signInGoogle}
        disabled={isPending}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 font-medium tracking-wider text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    className="h-11 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-11 w-full rounded-full font-semibold"
            disabled={isPending}
          >
            Sign in
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
