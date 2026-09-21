export interface PromotionalBanner {
  id: string;
  title: string;
  imageUrl?: string;
  targetUrl?: string;
  name?: string;
  priority?: number;
  image?: string;
  mobileImage?: string;
  shortDescription?: string;
  cta?: {
    label?: string;
    type?: string;
  };
  gameId?: string;
  redirectUrl?: string;
  [key: string]: unknown;
}

export interface PromotionalBannersApiResponse {
  success: boolean;
  data: PromotionalBanner[];
}
