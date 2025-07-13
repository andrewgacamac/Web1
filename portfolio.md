# Residential Portfolio Implementation Plan

## 1. Gallery Location & Structure
**Position:** Insert after "Our Installation Process" section (line 75)  
**Section Header:** "Recent Residential Projects"  
**Grid Layout:** 3-column responsive grid (matches portfolio.html pattern)

## 2. Image Organization Strategy
### Categories
1. **Family Yards**  
   - Size range: 500-1500 sq.ft  
   - Common features: Play areas, seating zones

2. **Pool Environments**  
   - Materials: Non-slip turf varieties  
   - Drainage focus examples

3. **Pet Solutions**  
   - Specialized drainage systems  
   - Odor control features

4. **Custom Designs**  
   - Shaped installations  
   - Multi-tone patterns

### Image Requirements
- Aspect Ratio: 4:3 (consistent with portfolio)
- Max File Size: 500KB per image
- Naming Convention: `res-[category]-[01-99].webp`

## 3. Interactive Elements Plan
### Hover Effects
- Subtle zoom (105% scale)
- Overlay with project specs:
  ```text
  Project Size: 850 sq.ft
  Installation Time: 2 days
  Turf Type: PetPremium Plus
  ```

### Click Behavior
1. Desktop: Lightbox with extended details
2. Mobile: Full-width carousel swipe

## 4. Technical Implementation
### CSS Additions
```css
/* Residential Gallery Extensions */
.res-gallery {
  @extend .portfolio-grid;
  margin: var(--spacing-lg) auto;
}

.res-gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.res-category-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(76, 175, 80, 0.9);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  color: var(--text-light);
  font-size: 0.9rem;
}
```

### Required JS Features
1. Lazy loading implementation
2. Touch event handling for mobile
3. Lightbox initialization

## 5. Accessibility Requirements
1. ARIA labels for gallery navigation
2. Contrast-checked text overlays
3. Keyboard navigation support

## 6. Quality Assurance Checklist
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verification
- [ ] Alt-text validation
- [ ] Performance audit (Lighthouse)
- [ ] Security scan for image uploads