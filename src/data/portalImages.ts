import { PortalImages } from '../types';
import defaultHeroBanner from '../assets/images/hero_transmigrasi_luwu_1791420200639.jpg';
import defaultCommodityKakao from '../assets/images/komoditas_kakao_luwu_1791420216171.jpg';
import defaultInfrastructure from '../assets/images/infrastruktur_transmigrasi_1791420229259.jpg';
import defaultLogoUrl from '../assets/images/Luwu_Utara_Logo_(North_Luwu).png';

export const DEFAULT_PORTAL_IMAGES: PortalImages = {
  logoUrl: defaultLogoUrl,
  heroBanner: defaultHeroBanner,
  commodityKakao: defaultCommodityKakao,
  infrastructure: defaultInfrastructure,
  uptImages: {}
};

export const sanitizePortalImages = (savedData?: string | null): PortalImages => {
  if (!savedData) return DEFAULT_PORTAL_IMAGES;
  try {
    const parsed = JSON.parse(savedData);
    const sanitize = (val?: string, fallback?: string): string => {
      if (!val || val.startsWith('/src/')) return fallback || '';
      return val;
    };
    return {
      logoUrl: sanitize(parsed.logoUrl, DEFAULT_PORTAL_IMAGES.logoUrl),
      heroBanner: sanitize(parsed.heroBanner, DEFAULT_PORTAL_IMAGES.heroBanner),
      commodityKakao: sanitize(parsed.commodityKakao, DEFAULT_PORTAL_IMAGES.commodityKakao),
      infrastructure: sanitize(parsed.infrastructure, DEFAULT_PORTAL_IMAGES.infrastructure),
      uptImages: parsed.uptImages || {}
    };
  } catch {
    return DEFAULT_PORTAL_IMAGES;
  }
};
