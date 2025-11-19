# Internal Linking Strategy - Ararat Skredderi

## Overview
Internal linking improves SEO by:
1. **Distributing page authority** - Links from high-authority pages (home) to important pages
2. **Establishing information hierarchy** - Breadcrumbs and contextual links show structure
3. **Improving crawlability** - Helps search engines discover all pages
4. **Increasing engagement** - Users find related content naturally
5. **Reducing bounce rates** - Provides natural next steps for visitors

---

## Current Internal Linking (Existing)

### Navigation Menu (All Pages)
- Home → Hjem
- Services → Tjenester
- About → Om Oss
- Gallery → Galleri
- Contact → Kontakt Oss

### Footer Links (All Pages)
- Home, Services, About, Gallery, Contact, Privacy (Personvern)

### Breadcrumbs (Schema Markup)
- Each page has BreadcrumbList schema showing: Home → Current Page

---

## Recommended Additional Internal Links

### Home Page (index.html)
**Purpose:** Hub for distribution of authority; should link to all important pages

**Suggested contextual links:**
```html
<!-- In services preview section -->
<a href="tjenester.html">Se alle tjenestene våre →</a>

<!-- In gallery section -->
<a href="galleri.html">Se hele galleriet →</a>

<!-- In about section -->
<a href="om-oss.html">Les mer om oss →</a>
```

**Anchor text keywords:** Natural, descriptive terms

---

### Services Page (tjenester.html)
**Purpose:** Convert visitors and drive to gallery/contact

**Suggested contextual links:**
```html
<!-- After each service description -->
"Se eksempler på <service> i <a href="galleri.html#dresser">galleriet</a>"

<!-- Bottom of page -->
<p>Klar til å starte? <a href="kontakt.html">Kontakt oss i dag →</a></p>
```

**Benefits:**
- Connects services to portfolio examples
- Creates natural path to contact form
- Uses relevant anchor text

---

### Gallery Page (galleri.html)
**Purpose:** Showcase work and drive to services/contact

**Suggested contextual links:**
```html
<!-- In gallery overlay or below images -->
<!-- Gallery items already have titles like "Skreddersøm Dress" -->
<!-- Add link to related service -->
"Interessert i denne tjenesten? <a href="tjenester.html">Les mer →</a>"

<!-- Filter button hint -->
<p>Klikk på kategorier over for å filtrere. 
   <a href="tjenester.html">Alle tjenestene våre</a></p>

<!-- Bottom of page -->
<p><a href="kontakt.html">Bestill en konsultasjon</a> eller 
   <a href="om-oss.html">les om vår erfaring</a></p>
```

**Benefits:**
- Drives traffic to services (high conversion page)
- Increases time on site (users browse gallery + other pages)
- Natural CTAs

---

### About Page (om-oss.html)
**Purpose:** Build trust and drive to services/contact

**Suggested contextual links:**
```html
<!-- In experience section -->
"Vi tilbyr <a href="tjenester.html">mange tjenester</a> 
 basert på år av erfaring."

<!-- In values section -->
"Se eksempler på vår kvalitet i <a href="galleri.html">galleriet</a>"

<!-- Bottom of page -->
<p>Interessert? <a href="kontakt.html">Ta kontakt med oss i dag</a></p>
```

**Benefits:**
- Links authority page (about) to conversion pages
- Creates natural information flow
- User journey: About → Learn → Gallery → Contact

---

### Contact Page (kontakt.html)
**Purpose:** Conversion; minimal external links but some helpful context

**Suggested contextual links:**
```html
<!-- Above contact form -->
<p><a href="tjenester.html">Usikker på hva du trenger?</a> 
   Se våre tjenester.</p>

<!-- After form -->
<p>Eller <a href="galleri.html">se eksempler på vårt arbeid</a></p>
```

**Benefits:**
- Provides alternative paths if user not ready to contact
- Reduces friction
- Keeps users engaged if contact form incomplete

---

## Implementation Priorities

### Phase 1 (Immediate - Quick Wins)
1. Add "Se alle tjenestene" link on home page
2. Add "Se hele galleriet" link on home page
3. Add "Kontakt oss" CTA on services page
4. Add "Bestill konsultasjon" link on about page

### Phase 2 (Short-term - Content Enhancement)
1. Add gallery → services contextual links in overlays
2. Add services → gallery contextual links
3. Add about → gallery links
4. Optimize anchor text across all pages

### Phase 3 (Ongoing - Experience Optimization)
1. Monitor which links get most clicks (Analytics)
2. A/B test different anchor text variations
3. Add "related services" suggestions in modals
4. Create service-specific landing pages if volume allows

---

## Anchor Text Best Practices

✅ **DO:**
- Use descriptive, keyword-relevant text: "Se skreddersøm tjenestene"
- Use action-oriented text: "Les mer", "Kontakt oss", "Se eksempler"
- Keep length 2-5 words
- Use natural language that fits context

❌ **DON'T:**
- Avoid generic "Click here" or "Read more"
- Don't over-optimize with exact match keywords
- Don't use too many links on one page (dilutes authority)
- Don't link to irrelevant pages

---

## Expected SEO Benefits

**Estimated improvements after implementation:**

| Metric | Current | After | Timeline |
|--------|---------|-------|----------|
| Pages crawled | 6 | 6 | Immediate |
| Internal links | 11 | 25+ | Week 1 |
| Link equity flow | Poor | Good | Week 2 |
| Avg time on site | Unknown | +20-30% | Month 1 |
| Bounce rate | Unknown | -10-15% | Month 1 |
| Ranking positions | Baseline | Improve | Month 2+ |

---

## Anchor Text Suggestions by Page

### Homepage
- "Se alle tjenestene våre →"
- "Besøk galleriet →"
- "Les om vår erfaring →"
- "Kontakt oss i dag →"

### Services
- "Se eksempler i galleriet"
- "Ring +47 91 92 19 08"
- "Fyll ut kontaktskjema"
- "Lær mer om denne tjenesten"

### Gallery
- "Interessert i denne tjenesten?"
- "Les mer om skreddersøm"
- "Se alle våre tjenester"
- "Kontakt oss for tilbud"

### About
- "Se alle tjenestene →"
- "Besøk galleriet →"
- "Bestill time →"
- "Ring oss på +47 91 92 19 08"

### Contact
- "Tilbake til tjenestene"
- "Se vårt arbeid"
- "Om vår bedrift"

---

## Technical Notes

**Link attributes:**
- Use standard `<a href="">` tags
- Avoid `javascript:` or unnecesary query parameters
- Links should use relative paths where possible: `/tjenester.html`
- Test all links regularly for 404s

**Mobile considerations:**
- Links should be large enough to tap easily (min 44px height)
- Avoid too many inline links (hard to tap)
- Use clear visual distinction for links (underline/color)

---

## Monitoring & Analytics

### Track these metrics:
- **Click-through rate** by link (which internal links drive traffic?)
- **Entry vs exit pages** (do users land on service pages via homepage?)
- **Page flow** (do users follow intended path: Home → Services → Gallery → Contact?)
- **Conversion rate** from internal links (which path converts best?)

### Google Analytics Setup:
- Enable internal link tracking
- Create segments for users who clicked internal links vs direct nav
- Set goals for "visited contact page" after clicking internal links

---

## Maintenance Schedule

**Weekly:**
- Spot-check that all links work (no broken links)

**Monthly:**
- Review Analytics for top-performing internal links
- Identify underperforming pages that might need more links

**Quarterly:**
- Audit all internal links for relevance
- Review anchor text optimization
- Test new link placements if needed

---

*This strategy aligns with Ararat Skredderi's customer journey: Awareness (about/home) → Consideration (services/gallery) → Decision (contact)*

