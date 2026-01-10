# Developer Platform Design System

**Status:** Foundation Complete  
**Version:** 1.0  
**Last Updated:** January 7, 2026

---

## 🎨 Design Principles

### Visual Identity
- **Dark Mode First**: Developer-optimized color scheme
- **Clean & Technical**: Inspired by Vercel, Stripe, and GitHub
- **Consistent Branding**: Aligned with AeThex blue/purple theme
- **Professional**: Business-ready, not gaming-flashy

### UX Principles
- **Developer Efficiency**: Keyboard shortcuts, quick actions
- **Progressive Disclosure**: Simple by default, power features available
- **Consistent Patterns**: Same interaction model across modules
- **Fast & Responsive**: < 100ms interaction latency

---

## 🎭 Typography

### Font Families

**Primary UI Font:**
```css
font-family: "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif;
```

**Code Font:**
```css
font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
```

**Usage in Components:**
- All UI text: Inter (default)
- Code blocks: JetBrains Mono (monospace)
- API endpoints: Monospace
- Documentation: Inter with generous line-height

### Typography Scale

```typescript
text-xs:   0.75rem  (12px)
text-sm:   0.875rem (14px)
text-base: 1rem     (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem  (20px)
text-2xl:  1.5rem   (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem  (36px)
```

---

## 🌈 Color System

### Brand Colors (AeThex)

```css
--aethex-500: hsl(250 100% 60%)  /* Primary brand color */
--aethex-600: hsl(250 100% 50%)  /* Darker variant */
--aethex-400: hsl(250 100% 70%)  /* Lighter variant */
```

### Semantic Colors

**Primary (Interactive Elements)**
```css
--primary: hsl(250 100% 60%)              /* Buttons, links, active states */
--primary-foreground: hsl(210 40% 98%)    /* Text on primary background */
```

**Background**
```css
--background: hsl(222 84% 4.9%)           /* Page background */
--foreground: hsl(210 40% 98%)            /* Primary text */
```

**Muted (Secondary Elements)**
```css
--muted: hsl(217.2 32.6% 17.5%)           /* Disabled, placeholders */
--muted-foreground: hsl(215 20.2% 65.1%)  /* Secondary text */
```

**Accent (Hover States)**
```css
--accent: hsl(217.2 32.6% 17.5%)          /* Hover backgrounds */
--accent-foreground: hsl(210 40% 98%)     /* Text on accent */
```

**Borders**
```css
--border: hsl(217.2 32.6% 17.5%)          /* Default borders */
--border/40: Border with 40% opacity      /* Subtle borders */
```

### Status Colors

```css
/* Success */
--success: hsl(120 100% 70%)
--success-bg: hsl(120 100% 70% / 0.1)

/* Warning */
--warning: hsl(50 100% 70%)
--warning-bg: hsl(50 100% 70% / 0.1)

/* Error */
--error: hsl(0 62.8% 30.6%)
--error-bg: hsl(0 62.8% 30.6% / 0.1)

/* Info */
--info: hsl(210 100% 70%)
--info-bg: hsl(210 100% 70% / 0.1)
```

### HTTP Method Colors

```css
GET:    hsl(210 100% 50%)  /* Blue */
POST:   hsl(120 100% 40%)  /* Green */
PUT:    hsl(50 100% 50%)   /* Yellow */
DELETE: hsl(0 100% 50%)    /* Red */
PATCH:  hsl(280 100% 50%)  /* Purple */
```

---

## 📐 Spacing System

Based on 4px base unit:

```typescript
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-8: 48px
--space-12: 64px
--space-16: 96px
```

### Common Patterns

```css
/* Card padding */
p-6         /* 24px - standard card */
p-4         /* 16px - compact card */

/* Section spacing */
py-12       /* 48px - mobile */
py-16       /* 64px - desktop */

/* Component gaps */
gap-4       /* 16px - between related items */
gap-6       /* 24px - between sections */
```

---

## 📦 Component Library

### Core Navigation Components

#### DevPlatformNav
**Location:** `/client/components/dev-platform/DevPlatformNav.tsx`

**Features:**
- Sticky header with backdrop blur
- Module switcher (Docs, API, SDK, Templates, Marketplace)
- Command palette trigger (Cmd+K)
- User menu
- Mobile responsive with hamburger menu

**Usage:**
```tsx
import { DevPlatformNav } from "@/components/dev-platform/DevPlatformNav";

<DevPlatformNav />
```

#### DevPlatformFooter
**Location:** `/client/components/dev-platform/DevPlatformFooter.tsx`

**Features:**
- AeThex ecosystem links
- Resources, Community, Company sections
- Social media links
- Legal links

**Usage:**
```tsx
import { DevPlatformFooter } from "@/components/dev-platform/DevPlatformFooter";

<DevPlatformFooter />
```

#### Breadcrumbs
**Location:** `/client/components/dev-platform/Breadcrumbs.tsx`

**Features:**
- Auto-generated from URL path
- Or manually specified items
- Home icon for root
- Clickable navigation

**Usage:**
```tsx
import { Breadcrumbs } from "@/components/dev-platform/Breadcrumbs";

// Auto-generated
<Breadcrumbs />

// Manual
<Breadcrumbs
  items={[
    { label: "Docs", href: "/docs" },
    { label: "Getting Started", href: "/docs/getting-started" },
    { label: "Installation" }
  ]}
/>
```

### Layout Components

#### DevPlatformLayout
**Location:** `/client/components/dev-platform/layouts/DevPlatformLayout.tsx`

**Features:**
- Wraps page content with nav and footer
- Optional hide nav/footer
- Flex layout with sticky nav

**Usage:**
```tsx
import { DevPlatformLayout } from "@/components/dev-platform/layouts/DevPlatformLayout";

<DevPlatformLayout>
  <YourPageContent />
</DevPlatformLayout>
```

#### ThreeColumnLayout
**Location:** `/client/components/dev-platform/layouts/ThreeColumnLayout.tsx`

**Features:**
- Left: Navigation sidebar (sticky)
- Center: Main content
- Right: Table of contents or code examples (optional, sticky)
- Responsive (collapses on mobile)

**Usage:**
```tsx
import { ThreeColumnLayout } from "@/components/dev-platform/layouts/ThreeColumnLayout";

<ThreeColumnLayout
  sidebar={<DocsSidebar />}
  aside={<TableOfContents />}
>
  <ArticleContent />
</ThreeColumnLayout>
```

### UI Components

#### CodeBlock
**Location:** `/client/components/dev-platform/ui/CodeBlock.tsx`

**Features:**
- Syntax highlighting (basic)
- Copy to clipboard button
- Optional line numbers
- Optional line highlighting
- Language badge
- File name header

**Usage:**
```tsx
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";

<CodeBlock
  code={`const game = new AeThex.Game();\ngame.start();`}
  language="typescript"
  fileName="example.ts"
  showLineNumbers={true}
  highlightLines={[2]}
/>
```

#### Callout
**Location:** `/client/components/dev-platform/ui/Callout.tsx`

**Features:**
- Four types: info, warning, success, error
- Optional title
- Icon included
- Semantic colors

**Usage:**
```tsx
import { Callout } from "@/components/dev-platform/ui/Callout";

<Callout type="warning" title="Important">
  Make sure to set your API key before deployment.
</Callout>
```

#### StatCard
**Location:** `/client/components/dev-platform/ui/StatCard.tsx`

**Features:**
- Dashboard metric display
- Optional icon
- Optional trend indicator (↑ +5%)
- Hover effect

**Usage:**
```tsx
import { StatCard } from "@/components/dev-platform/ui/StatCard";
import { Zap } from "lucide-react";

<StatCard
  title="API Calls"
  value="1.2M"
  description="Last 30 days"
  icon={Zap}
  trend={{ value: 12, isPositive: true }}
/>
```

#### ApiEndpointCard
**Location:** `/client/components/dev-platform/ui/ApiEndpointCard.tsx`

**Features:**
- HTTP method badge (color-coded)
- Endpoint path in monospace
- Description
- Clickable for details
- Hover effect

**Usage:**
```tsx
import { ApiEndpointCard } from "@/components/dev-platform/ui/ApiEndpointCard";

<ApiEndpointCard
  method="POST"
  endpoint="/api/creators"
  description="Create a new creator profile"
  onClick={() => navigate('/api-reference/creators')}
/>
```

---

## 🎯 Usage Patterns

### Page Structure (Standard)

```tsx
import { DevPlatformLayout } from "@/components/dev-platform/layouts/DevPlatformLayout";
import { Breadcrumbs } from "@/components/dev-platform/Breadcrumbs";

export default function MyPage() {
  return (
    <DevPlatformLayout>
      <div className="container py-10">
        <Breadcrumbs />
        <h1 className="text-4xl font-bold mt-4 mb-6">Page Title</h1>
        {/* Page content */}
      </div>
    </DevPlatformLayout>
  );
}
```

### Documentation Page

```tsx
import { DevPlatformLayout } from "@/components/dev-platform/layouts/DevPlatformLayout";
import { ThreeColumnLayout } from "@/components/dev-platform/layouts/ThreeColumnLayout";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";
import { Callout } from "@/components/dev-platform/ui/Callout";

export default function DocsPage() {
  return (
    <DevPlatformLayout>
      <ThreeColumnLayout
        sidebar={<DocsSidebar />}
        aside={<TableOfContents />}
      >
        <article className="prose prose-invert max-w-none">
          <h1>Getting Started</h1>
          <p>Install the AeThex SDK...</p>
          
          <CodeBlock
            code="npm install @aethex/sdk"
            language="bash"
          />
          
          <Callout type="info">
            Make sure Node.js 18+ is installed.
          </Callout>
        </article>
      </ThreeColumnLayout>
    </DevPlatformLayout>
  );
}
```

### Dashboard Page

```tsx
import { DevPlatformLayout } from "@/components/dev-platform/layouts/DevPlatformLayout";
import { StatCard } from "@/components/dev-platform/ui/StatCard";
import { Activity, Key, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <DevPlatformLayout>
      <div className="container py-10">
        <h1 className="text-4xl font-bold mb-8">Developer Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            title="API Calls"
            value="1.2M"
            icon={Activity}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="API Keys"
            value="3"
            icon={Key}
          />
          <StatCard
            title="Rate Limit"
            value="89%"
            description="Remaining"
            icon={Zap}
          />
        </div>
      </div>
    </DevPlatformLayout>
  );
}
```

---

## ♿ Accessibility

### Standards
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Focus indicators visible
- Semantic HTML
- ARIA labels where needed

### Keyboard Shortcuts
- `Cmd/Ctrl + K`: Open command palette
- `Tab`: Navigate forward
- `Shift + Tab`: Navigate backward
- `Enter/Space`: Activate buttons
- `Esc`: Close modals/dialogs

### Focus Management
```css
/* All interactive elements have visible focus */
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
```

### Screen Reader Support
- Alt text on all images
- Descriptive link text (no "click here")
- Form labels properly associated
- Status messages announced

---

## 📱 Responsive Design

### Breakpoints

```typescript
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Approach

```tsx
// Default: Mobile
<div className="text-sm">

// Desktop: Larger text
<div className="text-sm md:text-base lg:text-lg">

// Grid: 1 column mobile, 3 columns desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🚀 Performance

### Loading States
- Skeleton loaders for content
- Suspense boundaries for code splitting
- Progressive image loading

### Optimization
- Lazy load routes
- Code split heavy components
- Minimize bundle size
- Use production builds

---

## 📚 Additional Resources

- **Shadcn/ui Documentation**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/
- **Lucide Icons**: https://lucide.dev/

---

## ✅ Next Steps

1. **Add More Components:**
   - LanguageTabs (for code examples)
   - ApiKeyManager (dashboard)
   - UsageChart (analytics)
   - TemplateCard (templates)
   - Command Palette (global search)

2. **Enhance Existing:**
   - Add syntax highlighting to CodeBlock (Prism.js)
   - Implement full command palette
   - Add more comprehensive examples

3. **Documentation:**
   - Create Storybook for component showcase
   - Add more usage examples
   - Create component playground

---

**Document Version:** 1.0  
**Component Count:** 9 core components  
**Status:** Foundation Complete  
**Last Updated:** January 7, 2026
