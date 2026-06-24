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

const registerSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
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
    <div className="flex flex-col gap-8 lg:gap-5">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-semibold tracking-tight">Create account</h2>
        <p className="text-sm text-muted-foreground">
          Start free — design your first workflow in under ten minutes.
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 lg:space-y-4">
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Confirm password</FormLabel>
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
            Create account
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
