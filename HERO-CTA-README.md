# Hero CTA Section Documentation

## Overview
The Hero CTA section has been redesigned for improved conversion, accessibility, and mobile responsiveness. It features a two-column layout with dynamic content and comprehensive analytics tracking.

## Structure

### HTML Structure
```
<section> - Main hero container with navy gradient background
  ├── Gradient overlay (subtle radial effect)
  ├── Container wrapper (max-w-7xl)
  │   ├── Dynamic Month Ribbon (updates automatically)
  │   ├── Main Headline & Subline
  │   └── Two-Column Grid
  │       ├── Left Column: Outcomes list + Trust band
  │       └── Right Column: Offer card with CTA
  └── Wave Divider (SVG transition to next section)
```

## Key Features

### 1. Dynamic Month Display
The ribbon automatically shows the current month using JavaScript:
```javascript
const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
```

### 2. Card Policy Toggle
Configure the trial requirements using the `REQUIRE_CARD_FOR_TRIAL` flag:

```javascript
const REQUIRE_CARD_FOR_TRIAL = false; // Set to true to require card on file
```

- **false** (default): "No credit card required for your first lesson"
- **true**: "Free trial—card on file to hold your spot (no charge unless no-show)."

### 3. Family Savings Badge
Links to the pricing page with anchor:
```html
<a href="safestroke-pricing.html#family-savings">
  Family Savings: 10% off each additional package
</a>
```

## Accessibility Features

- **WCAG AA Compliant**: All colors meet contrast requirements
- **Semantic HTML**: Uses `<section>`, `<aside>`, `<h1>`, etc.
- **ARIA Labels**: Dynamic month has `aria-live="polite"`
- **Focus States**: All interactive elements have visible focus rings
- **Touch Targets**: Minimum 44px height for mobile interactions
- **Screen Reader Support**: Proper labeling for phone links and buttons

## Performance Optimizations

- **CSS Gradients**: No heavy background images
- **Inline Critical JS**: Dynamic month script loads immediately
- **SVG Wave**: Lightweight, scalable divider
- **No Layout Shift**: Fixed heights prevent content jumping

## Analytics Tracking

### Data Attributes
- `data-cta="hero_free_trial"` - Main CTA button
- `data-cta="hero_call"` - Phone number link

### Events Fired
1. **Facebook Pixel**: 
   - InitiateCheckout (free trial click)
   - Contact (phone click)
2. **Google Analytics** (if present): Custom events with location and type

## Responsive Breakpoints

- **320px**: Minimum width, stacked layout
- **640px** (sm): Improved spacing
- **768px** (md): Enhanced typography
- **1024px** (lg): Two-column layout
- **1280px** (xl): Maximum container width

## Color Palette

- Primary Blue: `#2284B8`
- Deep Navy: `#0B3856`
- Light Sky: `#E9F5FC`
- Success Green: `#23C552`
- White: `#ffffff`

## Testing Checklist

- [ ] Dynamic month displays correctly
- [ ] CTA button clicks track in analytics
- [ ] Mobile layout doesn't clip or overflow
- [ ] Wave divider scales properly
- [ ] Focus states are visible
- [ ] Family savings link works
- [ ] Card policy toggle functions
- [ ] Lighthouse Accessibility ≥ 95

## Maintenance Notes

1. To change the trial policy, modify `REQUIRE_CARD_FOR_TRIAL` in the inline script
2. To update tracking events, edit the analytics section in the script
3. The wave SVG can be customized by editing the path data
4. Family savings text should match actual pricing page offers

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Optimized for iOS Safari and Chrome
