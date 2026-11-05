/**
 * Infosys 2027 Software Engineer campaign — single source of truth.
 * Everything about the campaign lives here so the banner destination,
 * window, artwork and storage keys can be changed in one place.
 */

export const INFOSYS_SE_2027_CAMPAIGN = {
  campaignId: "infosys_se_2027",
  placement: "homepage_popup",
  /** Where the CTA leads. The destination page is created separately. */
  ctaUrl: "/infosys-se-2027",
  /** Preparation destination used across the Infosys 2027 page CTAs. */
  preparationUrl: "/infosys-se-2027/preparation",
  desktopBanner: "/images/infosysBanner/PC_size_Banner.png",
  mobileBanner: "/images/infosysBanner/phonesize_banner.png",
  desktopBannerSize: { width: 1728, height: 910 },
  mobileBannerSize: { width: 1173, height: 1341 },
  /** LocalStorage key storing { status: "dismissed" | "engaged", at: number } */
  storageKey: "cracknqt:campaign:infosys-se-2027",
  /** sessionStorage key — fires infosys_campaign_popup_session once per browser session */
  sessionEventKey: "cracknqt:campaign:infosys-se-2027:session-tracked",
  /** Popup is never shown after this date (configurable). */
  campaignEndsAt: new Date("2027-06-30T23:59:59+05:30").getTime(),
  /** Delay after the homepage loads before showing (ms). */
  delayMs: 1800,
} as const;

export type InfosysCampaignStatus = "dismissed" | "engaged";
