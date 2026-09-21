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
import Link from 'next/link';
import { getGamesBanner } from '@/services/banner';

export default async function HomePage() {
  const banners = await getGamesBanner().catch((error) => {
    console.error('Error fetching games banner:', error);
    return null;
  });

  console.log('Banner API response on HomePage:', banners);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold">Home</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Server Component → <code>getGamesBanner()</code> → backend banner API.
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
        {banners === null ? (
          <p className="mt-2 text-sm text-rose-600">Failed to load banners.</p>
        ) : banners.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">No banners returned.</p>
        ) : (
          <ul className="mt-3 list-inside list-disc text-sm">
            {banners.map((banner) => (
              <li key={banner.id}>{banner.title ?? banner.name ?? banner.id}</li>
            ))}
          </ul>
        )}
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
