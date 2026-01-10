# AeThex Spacing & Layout System

## Standardized Spacing Tokens

### Container Widths
- `max-w-7xl` - Dashboard, main app pages (1280px)
- `max-w-6xl` - Settings, forms, content pages (1152px) 
- `max-w-4xl` - Articles, documentation (896px)
- `max-w-2xl` - Centered cards, modals (672px)

### Page Padding
```tsx
// Standard page wrapper
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
```

### Vertical Spacing
- `space-y-2` - Tight grouped items (4px)
- `space-y-4` - Related content (16px)
- `space-y-6` - Card sections (24px)
- `space-y-8` - Page sections (32px)
- `space-y-12` - Major sections (48px)
- `space-y-16` - Section breaks (64px)

### Horizontal Spacing
- `gap-2` - Tight inline items (badges, tags)
- `gap-4` - Button groups, form fields
- `gap-6` - Card grids (2-3 cols)
- `gap-8` - Wide card grids (1-2 cols)

### Card Padding
- `p-4 sm:p-6` - Standard cards
- `p-6 lg:p-8` - Feature cards
- `p-8 lg:p-12` - Hero sections

## Layout Patterns

### Page Header
```tsx
<div className="space-y-4 mb-8">
  <h1 className="text-4xl font-bold">Title</h1>
  <p className="text-muted-foreground text-lg">Description</p>
</div>
```

### Grid Layouts
```tsx
// 3-column responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 2-column with sidebar
<div className="grid lg:grid-cols-[2fr,1fr] gap-8">
```

### Responsive Padding
```tsx
// Mobile-first approach
className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12"
```

## Common Issues Found

### ❌ Problems:
1. **Inconsistent container widths** - Some pages use `max-w-6xl`, others `max-w-7xl`, some have none
2. **Mixed padding units** - `px-3`, `px-4`, `px-6` all used randomly
3. **Unresponsive spacing** - Many pages don't adapt padding for mobile
4. **No vertical rhythm** - `space-y-*` used inconsistently
5. **Misaligned grids** - Gap sizes vary randomly (gap-2, gap-3, gap-4, gap-6)

### ✅ Solutions:
- Use `max-w-7xl` for all app pages
- Always use responsive padding: `px-4 sm:px-6 lg:px-8`
- Standard vertical spacing: `space-y-8` between major sections
- Standard gaps: `gap-4` for buttons, `gap-6` for cards
- Add `py-8 lg:py-12` to all page containers

## Implementation Checklist

- [ ] Dashboard pages
- [ ] Community pages  
- [ ] Settings pages
- [ ] Documentation pages
- [ ] Forms and modals
- [ ] Card components
- [ ] Navigation spacing
