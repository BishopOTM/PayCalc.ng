# Wyldpytch Corporate Website Rebuild Blueprint

## 1) Creative Direction

**Positioning:** premium, future-forward African music-tech brand.

**Visual DNA:**
- Dark mode-first with electric accents (violet/cyan/lime) and glassmorphism overlays.
- Editorial + corporate hybrid: bold headlines, modular cards, story-led media blocks.
- Motion-led polish with restrained animations that communicate intent, not decoration.

**Brand personality words:** visionary, credible, kinetic, global, culture-native.

---

## 2) Competitive UX Notes (Current Snapshot)

### Wyldpytch (current)
- Primary nav focuses on service areas (About, Distribution, Label Services, Publishing, Sync & Licensing, Giving Back, Contact).
- Current homepage copy is concise and credibility-focused but visually lean and content-light.

### MAD Solutions
- Service-heavy narrative with repeated conversion prompts and social proof sections (partners, testimonials, artists).
- Emphasis on platform offerings and artist enablement.

### Universal Music
- Strong media cadence with clearly surfaced **featured news** and frequent updates (dated entries).
- Corporate structure + investor/careers pathways.

### Sony Music UK
- Editorial homepage pattern: hero stories + article cards + artist/label pathways.
- News-led engagement and newsletter capture.

**Inference for Wyldpytch:** combine corporate trust signals with an always-fresh media layer (news, releases, case studies, insights).

---

## 3) Information Architecture (Recommended)

### Primary navigation
1. Home
2. Services
   - Distribution
   - Label Services
   - Publishing
   - Sync & Licensing
3. Artists & Catalog
4. Newsroom
5. Impact (Giving Back)
6. About
7. Contact

### Utility navigation
- Search
- Newsletter signup
- Client/artist portal CTA (if available)

### Footer clusters
- Services
- Company
- Newsroom
- Legal/Privacy/Terms
- Social channels

---

## 4) Homepage Wireframe (Media-Driven Corporate)

1. **Immersive Hero**
   - Full-bleed video/image montage (artists, studio, data dashboards).
   - Headline + subheadline + dual CTA:
     - `Talk to Us`
     - `Explore Services`
   - Ambient motion background (gradient mesh + subtle parallax).

2. **Proof Bar**
   - Live metrics: countries reached, catalog size, monthly streams, partners.
   - Animated counters on view.

3. **Featured Stories Carousel**
   - Latest announcements, artist milestones, partnership news.
   - Card-based with hover reveal and quick read-time indicators.

4. **Service Pillars Grid**
   - 4 core services with short descriptors + “Learn more” micro-CTA.
   - Icon + short animation on hover.

5. **Artist/Catalog Spotlight**
   - Dynamic grid for latest releases and spotlight artists.
   - Filter chips (Genre, Region, Format).

6. **Case Studies / Results**
   - Outcome-centric cards: challenge → strategy → measurable impact.

7. **Giving Back / Impact Block**
   - Mission + recent initiatives + impact numbers.

8. **Newsletter + Contact Strip**
   - “Stay ahead of African music commerce” signup.
   - Secondary CTA for business inquiries.

---

## 5) Micro-Interactions & Motion System

### Micro-interactions to include
- Magnetic hover effect on primary CTAs.
- Nav underline glide + active-state morph.
- Card tilt/parallax on mouse move (limited on mobile).
- Image reveal masks on scroll.
- Story cards: headline slide + metadata fade-in on hover.
- Progress indicator for page scroll.
- Section transition with soft blur-in + upward motion.

### Motion principles
- Duration: 120ms–280ms for UI interactions; 400ms–700ms for section reveals.
- Easing: use custom cubic-bezier for premium feel.
- Keep CLS-safe animation (opacity/transform primarily).

### Accessibility guardrails
- Respect `prefers-reduced-motion`.
- Avoid motion on critical content comprehension.
- Keep keyboard parity for all hover-triggered behaviors.

---

## 6) Design System Starter

### Color tokens (example)
- `bg.base`: `#080A12`
- `bg.elevated`: `#101426`
- `accent.primary`: `#7C5CFF`
- `accent.secondary`: `#20E3B2`
- `accent.highlight`: `#C9FF3B`
- `text.primary`: `#F4F7FF`
- `text.muted`: `#9AA4C2`

### Typography
- Display: Space Grotesk / Sora (headlines)
- Body: Inter / Manrope (copy)
- Optional mono accent for data labels

### Component baseline
- 12-column responsive grid
- 8px spacing system
- Cards: 16–24px radius, soft borders + glow on hover
- Buttons: high-contrast, clear focus ring, no ambiguous states

---

## 7) Content Model (CMS-Ready)

Use a headless CMS (Sanity, Contentful, or Strapi) with these core collections:
- `news_articles`
- `artist_profiles`
- `releases`
- `services`
- `case_studies`
- `impact_initiatives`
- `site_settings` (nav/footer/SEO/global banners)

### Editorial rhythm
- 2–4 news posts/month minimum.
- 1 case study/quarter.
- Release highlights synced weekly.

---

## 8) Tech Stack Recommendation

- **Frontend:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind + CSS variables (tokenized)
- **Animation:** Framer Motion + GSAP (only for advanced hero/story sequences)
- **CMS:** Sanity or Contentful
- **Media:** Cloudinary or Imgix for transformations
- **Analytics:** GA4 + Plausible/Segment + event taxonomy
- **SEO:** schema.org for Organization, NewsArticle, MusicGroup (where relevant)

---

## 9) Performance & SEO Requirements

- LCP target: <2.5s on 4G.
- Use optimized video fallbacks and poster images.
- Lazy-load below-the-fold media.
- Preload hero fonts/media responsibly.
- Server-side metadata for all newsroom pages.
- Structured data on article and artist pages.

---

## 10) Conversion Pathways

Primary goals:
- B2B inquiries (labels, platforms, brand partnerships)
- Artist onboarding interest
- Newsletter subscriptions

Suggested CTAs across site:
- `Book a Strategy Call`
- `Distribute with Wyldpytch`
- `Request Licensing Support`
- `Join the Newsletter`

---

## 11) Build Phases (Practical Delivery)

### Phase 1 — Discovery (1 week)
- Stakeholder interviews
- Brand/messaging alignment
- Content inventory + migration map

### Phase 2 — UX & Visual Design (2–3 weeks)
- IA finalization + wireframes
- High-fidelity homepage + key templates
- Motion prototype for hero/cards/nav

### Phase 3 — Development (3–5 weeks)
- Design system implementation
- CMS schema + content models
- Template development + QA

### Phase 4 — Launch & Optimization (ongoing)
- Analytics validation
- SEO indexing checks
- A/B testing on hero messaging and CTA hierarchy

---

## 12) Immediate Next Steps for You

1. Approve visual direction (dark-futuristic vs light-futuristic variant).
2. Finalize top 5 homepage messages (value proposition hierarchy).
3. Decide CMS preference and who owns content operations.
4. Gather launch content:
   - 6–10 hero-quality media assets
   - 8+ news posts
   - 4+ case studies/testimonials
5. Start with an interactive homepage prototype before full build.
