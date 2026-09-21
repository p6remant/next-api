import 'server-only';
import { serverApi } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api-routes';
import type {
  PromotionalBanner,
  PromotionalBannersApiResponse,
} from '@/types/banner';

export async function getGamesBanner(): Promise<PromotionalBanner[]> {
  const bannersResponse = await serverApi.get<PromotionalBannersApiResponse>(
    API_ENDPOINTS.BANNER.GAMES,
    { cachePolicy: 'no-store' }
  );
  return bannersResponse.data ?? [];
}
