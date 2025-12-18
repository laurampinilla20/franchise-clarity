# BrandDetail Layout Wireframe

## Desktop Layout (2 Columns)

### COLUMN 1 (Left - 70% width on lg, 50% on xl)
1. **Franchise Review Card** (Snapshot)
2. **Investment Section**
3. **Profitability Section**
4. **Comparison Section**
5. **Territories Section**
6. **Requirements Section**
7. **Next Steps Section**
8. **FAQs Section**

### COLUMN 2 (Right - 30% width on lg, 50% on xl)
1. **Talk to Advisor Card** (Top)
2. **Why buyers like this brand**
3. **Similar Brands**
4. **Ongoing Fees & Recurring Costs**
5. **Not sure you can afford this franchise?**
6. **Unlock full profitability analysis**
7. **Talk to Advisor Card** (Bottom - Sticky)

## Mobile Layout (Single Column)
- All sections flow in natural order
- Column 2 elements appear after Column 1 elements
- Use `order-` classes to control mobile order

## Visibility Rules

### Column 1 Elements (Desktop)
- All visible in Column 1
- Hidden in Column 2 on desktop (`lg:hidden`)

### Column 2 Elements (Desktop)
- All visible in Column 2
- Hidden in Column 1 on desktop (`lg:hidden`)
- Visible in Column 1 on mobile (`lg:hidden` in Column 1, visible in Column 2)

## Logged-In Content Modules
Each section can have additional logged-in content that appears when `isLoggedIn === true`:
- Investment: Investment Summary Table + 4 info cards
- Profitability: Net Franchisee Growth + Financial Transparency
- Comparison: Detailed charts + Turnover section
- Territories: Available + Sold Out territories
- Requirements: Ideal Profile + Requirements cards
- Next Steps: 11-step timeline
- FAQs: 10 detailed FAQ items


