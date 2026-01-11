/**
 * AeThex Design System Tokens
 * Centralized design constants for consistent layout, typography, and spacing
 */

export const DESIGN_TOKENS = {
  /**
   * Content Width Constraints
   * Use appropriate container based on content type
   */
  width: {
    // Text-heavy content (docs, articles, reading material)
    prose: "max-w-5xl",
    // Standard content sections (most pages)
    content: "max-w-6xl",
    // Wide layouts (dashboards, data tables, complex grids)
    wide: "max-w-7xl",
  },

  /**
   * Typography Scale
   * Consistent heading and text sizes across the application
   */
  typography: {
    // Page hero headings (H1)
    hero: "text-4xl md:text-5xl lg:text-6xl",
    // Major section headings (H2)
    sectionHeading: "text-3xl md:text-4xl",
    // Subsection headings (H3)
    subsectionHeading: "text-2xl md:text-3xl",
    // Card/component titles (H4)
    cardTitle: "text-xl md:text-2xl",
    // Stats and large numbers
    statNumber: "text-3xl md:text-4xl",
    // Body text (large)
    bodyLarge: "text-lg md:text-xl",
    // Body text (standard)
    body: "text-base",
    // Body text (small)
    bodySmall: "text-sm",
  },

  /**
   * Spacing Scale
   * Vertical spacing between sections and elements
   */
  spacing: {
    // Tight spacing within components
    tight: "space-y-4",
    // Standard spacing between related elements
    standard: "space-y-6",
    // Spacing between sections
    section: "space-y-12",
    // Major page sections
    page: "space-y-20",
  },

  /**
   * Padding Scale
   * Internal padding for cards and containers
   */
  padding: {
    // Compact elements
    compact: "p-4",
    // Standard cards and containers
    standard: "p-6",
    // Feature cards with more emphasis
    feature: "p-8",
    // Hero sections and CTAs
    hero: "p-12",
    // Responsive vertical padding for page sections
    sectionY: "py-16 lg:py-24",
  },

  /**
   * Grid Layouts
   * Standard grid configurations for responsive layouts
   */
  grid: {
    // Two-column layout
    cols2: "grid-cols-1 md:grid-cols-2",
    // Three-column layout
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    // Four-column layout
    cols4: "grid-cols-2 md:grid-cols-4",
    // Standard gap between grid items
    gapStandard: "gap-6",
    // Larger gap for emphasized spacing
    gapLarge: "gap-8",
  },
} as const;

/**
 * Helper function to combine design tokens
 * Usage: cn(DESIGN_TOKENS.width.content, "mx-auto", "px-4")
 */
export const getContentContainer = (
  width: keyof typeof DESIGN_TOKENS.width = "content"
) => {
  return `${DESIGN_TOKENS.width[width]} mx-auto px-4`;
};
