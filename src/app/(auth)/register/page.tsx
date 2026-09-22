'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
// import Input from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { EyeIcon, EyeOffIcon } from '@/components/icons';
// import { SocialAuthGroup } from '@/components/modules/auth/social-auth';
// import AuthSplitLayout from '@/components/modules/auth/auth-wrapper';
// import { AUTH_HERO_CARD } from '../login/page';
import { registerSchema } from '@/lib/validations/auth';
import { useRegisterMutation } from '@/services/auth';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const router = useRouter();
  const { mutateAsync: register, isLoading, error } = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      promoCode: '',
      agreed: false,
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await register({
          email: value.email,
          password: value.password,
          promoCode: value.promoCode || undefined,
        });
        router.push('/');
      } catch {
        // Surfaced via the `error` state below.
      }
    },
  });

  const inputClass = (hasError: boolean) =>
    `w-full rounded border px-3 py-2 ${hasError ? 'border-rose-500' : 'border-zinc-300'}`;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-black uppercase md:text-[40px]">
        CREATE ACCOUNT WITH EMAIL
      </h1>
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
                  htmlFor="register-email"
                  className="mb-1.5 block text-sm font-semibold uppercase"
                >
                  EMAIL ADDRESS<span className="text-[#FFB800]">*</span>
                </label>
                <input
                  id="register-email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  autoComplete="email"
                  className={inputClass(hasError)}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <form.Field name="password">
            {(field) => {
              const hasError =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-1.5 block text-sm font-semibold uppercase"
                  >
                    PASSWORD<span className="text-[#FFB800]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="register-password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={inputClass(hasError)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                </div>
              );
            }}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => {
              const hasError =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div>
                  <label
                    htmlFor="register-confirm-password"
                    className="mb-1.5 block text-sm font-semibold uppercase"
                  >
                    CONFIRM PASSWORD<span className="text-[#FFB800]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="register-confirm-password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={inputClass(hasError)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="shrink-0 rounded border border-zinc-300 px-2 text-sm"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {hasError && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-500">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="promoCode">
          {(field) => (
            <div>
              <label
                htmlFor="register-promo-code"
                className="mb-1.5 block text-sm font-semibold uppercase"
              >
                PROMO CODE
              </label>
              <div className="flex gap-2">
                <input
                  id="register-promo-code"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  type={showPromoCode ? 'text' : 'password'}
                  autoComplete="off"
                  className={inputClass(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPromoCode(!showPromoCode)}
                  className="shrink-0 rounded border border-zinc-300 px-2 text-sm"
                >
                  {showPromoCode ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="agreed">
          {(field) => {
            const hasError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div>
                <div className="mt-1 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="register-agreed"
                    name={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mt-0.5 h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="register-agreed"
                    className="cursor-pointer text-[13px] leading-relaxed"
                  >
                    I agree to receive news, updates, and promotional offers via
                    email
                  </label>
                </div>
                {hasError && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {error && (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
            {error.message}
          </div>
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isLoading}
              className="mt-2 h-11 w-full rounded bg-rose-500 font-bold text-white disabled:opacity-50"
            >
              {isSubmitting || isLoading ? 'Creating...' : 'Create Account'}
            </button>
          )}
        </form.Subscribe>
      </form>

      {/* <SocialAuthGroup /> */}

      <p className="mt-6 text-center text-base font-medium">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#FFCC29] underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
