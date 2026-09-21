'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
// import Input from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { EyeIcon, EyeOffIcon } from '@/components/icons';
// import AuthSplitLayout, {
//   AuthRightCardProps,
// } from '@/components/modules/auth/auth-wrapper';
// import { SocialAuthGroup } from '@/components/modules/auth/social-auth';
// import { ASSETS_PATH } from '@/constants/assets.path';
import { loginSchema } from '@/lib/validations/auth';
import { useLoginMutation } from '@/services/auth';

// export const AUTH_HERO_CARD: AuthRightCardProps = {
//   badgeLabel: 'LIVE NOW',
//   subTitle: 'VEGA CHAMPIONSHIP 2025',
//   title: 'Claim Your Daily Gold and Compete with the Elite',
//   description:
//     'Compete in automated esports matches, rise through the local leaderboards, and redeem exclusive rewards in the Fortune Wheel.',
//   imageUrl: ASSETS_PATH.AUTH_BANNER,
// };

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    mutateAsync: login,
    isExecuting,
    executionError,
  } = useLoginMutation();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        router.push('/');
      } catch (err) {
        console.error('Login error:', err);
      }
    },
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-black uppercase">SIGN IN WITH EMAIL</h1>
      <p className="mt-2 text-lg">
        Enter your credentials to access your players dashboard
      </p>

      <form
        className="mt-8 flex flex-col gap-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-sm font-semibold uppercase"
                >
                  EMAIL ADDRESS<span className="text-[#FFB800]">*</span>
                </label>
                <input
                  id="login-email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  autoComplete="email"
                  className={`w-full rounded border px-3 py-2 ${hasError ? 'border-rose-500' : 'border-zinc-300'}`}
                />
                {hasError && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-sm font-semibold uppercase"
                >
                  PASSWORD<span className="text-[#FFB800]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="login-password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full rounded border px-3 py-2 ${hasError ? 'border-rose-500' : 'border-zinc-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="shrink-0 rounded border border-zinc-300 px-2 text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {hasError && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
                <div className="mt-1.5 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#FFCC29] hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            );
          }}
        </form.Field>

        {executionError && (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
            {executionError.message}
          </div>
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isExecuting}
              className="mt-1 h-11 w-full rounded bg-rose-500 font-bold text-white disabled:opacity-50"
            >
              {isSubmitting || isExecuting ? 'Signing In...' : 'Sign In'}
            </button>
          )}
        </form.Subscribe>
      </form>

      {/* <SocialAuthGroup /> */}

      <p className="mt-6 text-center text-base font-medium">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-[#FFCC29] underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
