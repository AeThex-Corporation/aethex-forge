/**
 * AeThex Design System - Spacing & Layout Utilities
 * Consistent spacing tokens across the entire application
 */

export const SPACING = {
  // Container Classes
  CONTAINER: "container mx-auto px-4 sm:px-6 lg:px-8",
  
  // Page Containers with vertical padding
  PAGE_CONTAINER: "container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12",
  
  // Max Widths
  MAX_WIDTH: {
    full: "max-w-7xl",      // Main app pages (1280px)
    content: "max-w-6xl",   // Content pages (1152px)
    article: "max-w-4xl",   // Articles, docs (896px)
    card: "max-w-2xl",      // Centered cards (672px)
  },
  
  // Vertical Spacing (space-y-*)
  VERTICAL: {
    xs: "space-y-2",   // 8px - Tight grouped items
    sm: "space-y-4",   // 16px - Related content
    md: "space-y-6",   // 24px - Card sections
    lg: "space-y-8",   // 32px - Page sections
    xl: "space-y-12",  // 48px - Major sections
    "2xl": "space-y-16", // 64px - Section breaks
  },
  
  // Horizontal Gaps
  GAP: {
    xs: "gap-2",  // 8px - Badges, tags
    sm: "gap-4",  // 16px - Buttons, forms
    md: "gap-6",  // 24px - Card grids
    lg: "gap-8",  // 32px - Wide layouts
  },
  
  // Card Padding
  CARD: {
    sm: "p-4 sm:p-6",
    md: "p-6 lg:p-8",
    lg: "p-8 lg:p-12",
  },
} as const;

/**
 * Utility functions for building class strings
 */
export const buildPageContainer = (maxWidth: keyof typeof SPACING.MAX_WIDTH = "full") => {
  return `${SPACING.PAGE_CONTAINER} ${SPACING.MAX_WIDTH[maxWidth]}`;
};

export const buildContainer = (maxWidth: keyof typeof SPACING.MAX_WIDTH = "full") => {
  return `${SPACING.CONTAINER} ${SPACING.MAX_WIDTH[maxWidth]}`;
};
