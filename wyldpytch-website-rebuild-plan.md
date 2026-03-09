# Wyldpytch Corporate Website Rebuild Blueprint

## 1) Vision
Build a **futuristic, premium, media-first corporate website** that positions Wyldpytch as a forward-thinking creative/technology brand.

### Experience goals
- High-impact first impression within 3 seconds.
- Editorial + showcase structure (content-driven with stories, case studies, releases).
- Smooth, meaningful micro-interactions (not decorative noise).
- Fast load performance despite rich media.
- Clear conversion routes (contact, project inquiries, partnership leads, newsletter/community).

## 2) Design Direction

### Visual language
- **Theme:** Dark futuristic base with luminous accents.
- **Mood keywords:** cinematic, precise, energetic, immersive, premium.
- **Grid:** Asymmetric modular grid for editorial sections + strict rhythm for corporate clarity.
- **Typography pairing:**
  - Display: Space Grotesk / Sora / Neue Montreal style.
  - Body: Inter / Manrope for readability.
- **Color system (example):**
  - Base: `#070B14`
  - Surface: `#0F1626`
  - Primary glow: `#5B8CFF`
  - Secondary accent: `#00E0FF`
  - Highlight: `#A855F7`
  - Text high-contrast: `#EAF2FF`
  - Text muted: `#8AA0C2`

### UI motifs
- Subtle gradient noise overlays.
- Thin luminous borders on hover/focus.
- Soft glassmorphism on cards used sparingly.
- Scroll-linked parallax layers for hero and media sections.
- Animated line/divider systems to guide attention.

## 3) Information Architecture (Media/Content-driven)

### Primary navigation
- Home
- About
- Services
- Work / Projects
- Media (News, Insights, Releases)
- Careers
- Contact

### Homepage content map
1. **Hero (immersive):**
   - Headline + positioning statement.
   - Background video loop or WebGL gradient field.
   - Two CTAs: "Start a Project" and "View Work".
2. **Capability strip:** concise service cards with hover reveals.
3. **Featured work carousel:** full-bleed project highlights.
4. **Media highlights:** latest 3–4 stories/videos/releases.
5. **Proof block:** client logos, stats, awards, social proof.
6. **Process timeline:** discovery → strategy → production → scale.
7. **CTA footer block:** inquiry form + newsletter.

### Media hub structure
- Tabs/filters: All, News, Insights, Press, Video.
- Card-based feed with rich thumbnails and metadata.
- "Editor’s pick" large feature card.
- Search + topic tags.
- Individual article pages with inline media modules (quote blocks, short clips, pull stats, embedded galleries).

## 4) Micro-interaction Strategy

### Principles
- Every interaction must communicate **state, hierarchy, or progress**.
- Keep durations typically between 120–280ms for UI transitions.
- Use spring motion only where it improves perceived responsiveness.

### Key interactions
- Hover lift + border glow for cards/buttons.
- Magnetic CTA button effect (small cursor attraction).
- Navigation underline animation with direction-aware motion.
- Scroll progress indicator on long-form content pages.
- Section reveal animations triggered by viewport entry.
- Cursor-aware media previews in project lists.
- Page transitions with fast fade/blur compositing.

### Accessibility guardrails
- Respect `prefers-reduced-motion`.
- Maintain visible focus states for keyboard users.
- Ensure animation does not convey essential meaning alone.

## 5) UX Recommendations
- Keep primary CTA persistent in header on desktop.
- Use concise copy blocks with optional "Read more" expansions.
- Introduce sticky in-page nav for long service pages.
- Place trust indicators before major conversion forms.
- Add context-rich form flows (project type, timeline, budget band).

## 6) Tech + Performance Stack

### Suggested stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + CSS variables for theming
- **Motion:** Framer Motion + GSAP (for selective scroll sequences)
- **CMS:** Sanity / Contentful / Strapi (for media-first editorial workflow)
- **Media:** Cloudinary or similar for adaptive media delivery

### Performance targets
- LCP < 2.5s (mobile)
- CLS < 0.1
- INP < 200ms
- Lazy-load non-critical media and defer below-the-fold animations.
- Use modern formats (AVIF/WebP) and responsive image sets.

## 7) Content Strategy
- Publish recurring verticals:
  - Industry commentary
  - Behind-the-scenes production stories
  - Client impact case studies
  - Culture/careers updates
- Establish a monthly editorial cadence and visual template library.
- Use a consistent metadata taxonomy for filtering and SEO.

## 8) Competitive Differentiation vs Referenced Sites
Inspired by players like MAD Solutions, Universal Music, and Sony Music, Wyldpytch can stand out by:
- Combining **corporate credibility** with **editorial storytelling** in one coherent interface.
- Offering stronger narrative case-study structure (challenge → execution → measurable outcome).
- Delivering refined motion design without compromising speed/performance.

## 9) Build Roadmap

### Phase 1: Discovery (1 week)
- Brand, audience, and conversion goals workshop.
- Content audit and migration matrix.
- Define KPI baseline (traffic, engagement, lead quality).

### Phase 2: UX + Visual System (2 weeks)
- Sitemap and low-fidelity wireframes.
- High-fidelity design system (type scale, spacing, components, motion tokens).
- Prototype hero + project + media experiences.

### Phase 3: Development (3–4 weeks)
- Implement core templates and CMS schema.
- Build reusable sections/modules.
- Integrate animation patterns and media optimization.

### Phase 4: QA + Launch (1 week)
- Accessibility audit (WCAG 2.1 AA target).
- Performance tuning and SEO pass.
- Analytics + event tracking setup.

### Phase 5: Post-launch optimization (ongoing)
- A/B test CTA copy and layout variants.
- Measure media engagement and tune content hierarchy.
- Iterate on top-exit pages.

## 10) Starter Component Inventory
- Hero with video/WebGL background
- Dual CTA button group
- Logo cloud module
- Project showcase slider
- Media feed cards (standard + featured)
- Metrics/stat strip
- Testimonial/quote slider
- Inquiry form with progressive fields
- Newsletter block
- Footer mega-nav with social and legal links

## 11) Success Metrics
- +30% increase in average session duration.
- +25% increase in inquiry conversion rate.
- +40% growth in media/content page traffic.
- Bounce rate reduction on homepage and service pages.
