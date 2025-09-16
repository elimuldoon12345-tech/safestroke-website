# SafeStroke Mobile Testing Checklist

## 📱 Device Testing Matrix

### Critical Breakpoints
- [ ] **360px** - Small Android (Galaxy S8)
- [ ] **375px** - iPhone SE/12 Mini
- [ ] **393px** - iPhone 14/15
- [ ] **414px** - iPhone Plus models
- [ ] **768px** - iPad Portrait
- [ ] **1024px** - iPad Landscape
- [ ] **1440px** - Desktop

---

## ✅ Page-by-Page Mobile Validation

### 🏠 Homepage (index.html)
- [ ] Hero text readable at 360px
- [ ] Hero CTA "Book Free Lesson" accessible
- [ ] Program cards stack vertically on mobile
- [ ] Reviews don't overflow horizontally
- [ ] Footer links accessible
- [ ] No horizontal scroll

### 📚 Programs (safestroke-programs.html)
- [ ] Program cards stack properly
- [ ] "Strokelet — Level 1/2" text doesn't break
- [ ] Age badges visible
- [ ] CTA buttons full width on mobile
- [ ] Tab navigation works with touch

### 💰 Pricing (safestroke-pricing.html)
- [ ] Pricing cards stack vertically
- [ ] "First Lesson Free" badge doesn't clip
- [ ] Price text scales appropriately
- [ ] Comparison table scrolls horizontally if needed
- [ ] CTAs remain accessible

### 👥 About Us (safestroke-aboutus.html)
- [ ] Team photos scale properly
- [ ] Bio text readable
- [ ] Values section stacks correctly
- [ ] Contact info accessible

### ⭐ Reviews (safestroke-reviews.html)
- [ ] Review quotes clamp to 3 lines
- [ ] Author names don't overflow
- [ ] Star ratings align properly
- [ ] "View on Google" link accessible
- [ ] Review cards stack vertically

### 📍 Our Location (safestroke-location.html)
- [ ] Map container responsive
- [ ] Address text readable
- [ ] Phone number clickable
- [ ] Hours table fits screen
- [ ] Directions link works

### 📝 Booking (safestroke-booking.html)
- [ ] Form fields full width
- [ ] Date picker accessible
- [ ] Program selection works
- [ ] Payment form responsive
- [ ] Success messages visible

---

## 🎯 Global Components

### Navigation
- [ ] Mobile menu hamburger visible
- [ ] Menu opens/closes properly
- [ ] Links accessible with touch
- [ ] Active state visible
- [ ] Logo scales appropriately

### Sticky CTA (Mobile Only)
- [ ] Appears only on mobile (<768px)
- [ ] Fixed to bottom
- [ ] Doesn't cover content (80px padding)
- [ ] Button text: "Book Free Lesson"
- [ ] Z-index above content

### Buttons
- [ ] Minimum 44px touch target
- [ ] Text doesn't overflow
- [ ] Hover states work on touch
- [ ] Focus states visible

### Cards
- [ ] Consistent 16px border radius
- [ ] Padding scales properly
- [ ] Shadows visible
- [ ] Hover effects on touch

### Typography
- [ ] Headers use clamp() for scaling
- [ ] Body text readable (min 14px)
- [ ] Line height appropriate
- [ ] No text overflow

---

## 🐛 Common Mobile Issues to Check

### Layout Issues
- [ ] No horizontal scroll at any width
- [ ] No content cut off at edges
- [ ] No overlapping elements
- [ ] Images don't break layout
- [ ] Tables scroll horizontally if needed

### Performance
- [ ] Images optimized for mobile
- [ ] Lazy loading implemented
- [ ] Touch interactions responsive
- [ ] Smooth scrolling works

### Accessibility
- [ ] Touch targets ≥ 44px × 44px
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Pinch-to-zoom not disabled
- [ ] Form labels accessible

### Forms
- [ ] Input fields scale properly
- [ ] Keyboards trigger correctly
- [ ] Error messages visible
- [ ] Submit buttons accessible
- [ ] Date pickers work on touch

---

## 🔧 Testing Tools

### Browser DevTools
1. Chrome DevTools Device Mode
2. Firefox Responsive Design Mode
3. Safari Responsive Design Mode

### Online Tools
- [BrowserStack](https://www.browserstack.com)
- [Responsinator](http://www.responsinator.com)
- [Am I Responsive](http://ami.responsivedesign.is)

### Physical Testing
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] iPad Safari
- [ ] Samsung Internet

---

## 📊 Test Results Summary

| Page | 360px | 375px | 768px | 1024px | Issues Found |
|------|-------|-------|-------|--------|--------------|
| Home | ✅ | ✅ | ✅ | ✅ | None |
| Programs | | | | | |
| Pricing | | | | | |
| About | | | | | |
| Reviews | | | | | |
| Location | | | | | |
| Booking | | | | | |

---

## 🚀 Sign-off

- [ ] **QA Lead**: All pages tested and approved
- [ ] **Design Lead**: Visual consistency verified
- [ ] **Dev Lead**: Technical implementation correct
- [ ] **Project Manager**: Ready for production

**Date**: _______________  
**Version**: 1.0  
**Tested By**: _______________

---

## 📝 Notes

### Known Limitations
- Payment forms require Stripe's own responsive handling
- Map embeds have Google's default mobile behavior
- Calendar widget has third-party constraints

### Future Improvements
- Consider implementing container queries
- Add preference for reduced motion
- Implement dark mode support
- Add offline functionality

---

*Testing checklist based on SafeStroke Brand Guidelines v1.0*
