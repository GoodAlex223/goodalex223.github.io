# Manual Testing Scenarios

Manual testing checklist for the portfolio website.

---

## Responsive Design

### Mobile (375px)

- [ ] Navigation fits on one line
- [ ] Hero text readable, not cramped
- [ ] Project cards stack vertically (1 column)
- [ ] Skill groups stack vertically
- [ ] Contact links stack vertically
- [ ] No horizontal scrolling

### Tablet (768px)

- [ ] Project cards in 2-column grid
- [ ] Skill groups in 2-column grid
- [ ] Contact links wrap horizontally
- [ ] Adequate spacing between elements

### Desktop (1920px)

- [ ] Project cards in 3-column grid
- [ ] Skill groups in 4-column grid
- [ ] Container has max-width (not full screen)
- [ ] Hero section uses more vertical space

---

## Navigation

- [ ] Clicking "About" scrolls to About section
- [ ] Clicking "Projects" scrolls to Projects section
- [ ] Clicking "Skills" scrolls to Skills section
- [ ] Clicking "Contact" scrolls to Contact section
- [ ] Smooth scroll animation works
- [ ] Header stays sticky when scrolling

---

## Links

### Internal

- [ ] "View Projects" button scrolls to Projects
- [ ] "Get in Touch" button scrolls to Contact
- [ ] "See more projects on GitHub" has external link indicator

### External (open in new tab)

- [ ] GitHub project links work
- [ ] Wokwi simulation links work
- [ ] Vercel demo link works
- [ ] Frontend Mentor profile link works
- [ ] Email link opens mail client
- [ ] LinkedIn profile link works
- [ ] Telegram link works
- [ ] Footer GitHub link works

---

## Accessibility

### Keyboard Navigation

- [ ] Tab through entire page in logical order
- [ ] Skip link appears on first Tab press
- [ ] Skip link jumps to main content
- [ ] All buttons/links have focus indicator
- [ ] Can activate buttons with Enter key

### Screen Reader

- [ ] Page has proper heading hierarchy (h1 → h2 → h3)
- [ ] Images have alt text (N/A - no images currently)
- [ ] Links have descriptive text or aria-labels
- [ ] Sections are properly labeled

### Reduced Motion

- [ ] With `prefers-reduced-motion: reduce`, no animations play
- [ ] Smooth scroll disabled when reduced motion preferred

---

## Visual

### Typography

- [ ] Inter font loads correctly
- [ ] Fallback fonts work if Inter fails
- [ ] Text is readable at all sizes
- [ ] Proper contrast between text and background

### Colors

- [ ] Category badges have correct colors (Backend=green, IoT=orange, Web=blue, Tools=purple)
- [ ] Accent color consistent throughout
- [ ] No color contrast issues (text readable)

### Components

- [ ] Project cards have hover effect (lift + shadow)
- [ ] Buttons have hover states
- [ ] Links change color on hover
- [ ] Icons display correctly

---

## Browser Testing

### Chrome (latest)

- [ ] All features work
- [ ] CSS Grid renders correctly
- [ ] CSS Custom Properties work

### Firefox (latest)

- [ ] All features work
- [ ] Smooth scroll works
- [ ] Focus styles correct

### Safari (latest)

- [ ] All features work
- [ ] Fonts render correctly
- [ ] Sticky header works

### Edge (latest)

- [ ] All features work
- [ ] No layout issues

---

## Performance

- [ ] Page loads in under 3 seconds
- [ ] No layout shift during load
- [ ] Fonts don't cause flash of unstyled text (FOUT)

---

## Print

- [ ] Page prints reasonably
- [ ] Navigation hidden in print
- [ ] Links show URLs (or are underlined)
- [ ] Dark backgrounds don't waste ink (use print styles)

---

*Last updated: 2026-01-20*
