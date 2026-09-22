// import Container from '@/components/layout/container.layout';
// import PromoBannerCarousel from '@/components/modules/home/promo-banner';
// import { PROMO_BANNERS } from '@/constants/banner';
// import LiveRtpSection from '@/components/modules/home/live-rtp';
// import { coldGames, hotGames } from '@/constants/live-rtp.game';
// import EarlyAccessSection from '@/components/modules/home/early-access';
// import { EARLY_ACCESS_GAMES } from '@/constants/early-access';
// import MostPopularSection from '@/components/modules/home/most-popular';
// import { MOST_POPULAR_GAMES } from '@/constants/most-popular';
// import HighlightsSection from '@/components/modules/home/highlight';
// import { HIGHLIGHTS_DATA } from '@/constants/highlights';
// import TopWinsSection from '@/components/modules/home/top-win';
// import { MONETARY_GAMES_MOCK, XBET_GAMES_MOCK } from '@/constants/top-wins';
// import UpcomingGamesSection from '@/components/modules/home/upcoming-games';
// import { UPCOMING_GAMES_DATA } from '@/constants/upcoming-games';
// import FaqSection from '@/components/modules/home/faqs';
// import BenefitsSection from '@/components/modules/home/benefits';
import { Suspense } from 'react';
import Link from 'next/link';
import { getGamesBanner } from '@/services/banner';
import type { PromotionalBanner } from '@/types/banner';

function BannerSkeleton() {
  return (
    <div className="mt-3 animate-pulse space-y-2" aria-label="Loading banners">
      <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function BannerErrorAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-500"
    >
      {message}
    </div>
  );
}

function BannerCarousel({ banners }: { banners: PromotionalBanner[] }) {
  if (banners.length === 0) {
    return <p className="mt-2 text-sm text-zinc-500">No banners returned.</p>;
  }

  return (
    <ul className="mt-3 list-inside list-disc text-sm">
      {banners.map((banner) => (
        <li key={banner.id}>{banner.title ?? banner.name ?? banner.id}</li>
      ))}
    </ul>
  );
}

/**
 * Data fetch stays inside a nested Server Component so the outer page can
 * render immediately and Suspense can show a skeleton while this awaits.
 */
async function BannerSection() {
  let banners: PromotionalBanner[] | null = null;

  try {
    banners = await getGamesBanner();
  } catch (error) {
    console.error('Error fetching games banner:', error);
  }

  if (banners === null) {
    return <BannerErrorAlert message="Failed to load banners." />;
  }

  return <BannerCarousel banners={banners} />;
}

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold">Home</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Server Component → <code>getGamesBanner()</code> → backend banner
          API.
        </p>
        <nav className="mt-4 flex gap-4 text-sm">
          <Link href="/login" className="underline">
            Login
          </Link>
          <Link href="/register" className="underline">
            Register
          </Link>
        </nav>
      </div>

      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Games banner (live API)</h2>
        <Suspense fallback={<BannerSkeleton />}>
          <BannerSection />
        </Suspense>
      </section>

      {/*
      <section className="pt-0 md:pt-8 lg:pt-12 xl:pt-16">
        <Container className="px-0 sm:px-6 lg:px-10 2xl:px-0">
          <PromoBannerCarousel banners={PROMO_BANNERS} />
        </Container>
      </section>
      ... remaining home sections from spec ...
      */}
    </main>
  );
}
