# Ararat Skredderi - SEO Implementation Checklist

## Production Domain Launch Preparation
**Domain:** araratskredderi.no  
**Status:** Ready for DNS connection  
**Last Updated:** 2025-11-19

---

## ✅ Core SEO Implementation

### 1. **Meta Tags & Headers**
- ✅ All 6 pages have unique, keyword-optimized title tags (50-60 chars)
- ✅ All pages have compelling meta descriptions (155-160 chars)
- ✅ Meta robots tags configured correctly
  - Main pages: `index, follow`
  - Personvern page: `noindex, follow` (legal page)
- ✅ Viewport meta tag present: `width=device-width, initial-scale=1.0`
- ✅ Theme color meta tag: `#0b5fff`

### 2. **Canonical URLs**
- ✅ All 6 pages have canonical tags pointing to araratskredderi.no
  - index.html → https://araratskredderi.no/
  - tjenester.html → https://araratskredderi.no/tjenester.html
  - galleri.html → https://araratskredderi.no/galleri.html
  - om-oss.html → https://araratskredderi.no/om-oss.html
  - kontakt.html → https://araratskredderi.no/kontakt.html
  - personvern.html → https://araratskredderi.no/personvern.html

### 3. **Open Graph & Social Media Tags**
- ✅ og:type configured (website/business.business as appropriate)
- ✅ og:url points to correct pages
- ✅ og:title and og:description for each page
- ✅ og:site_name: "Ararat Skredderi"
- ✅ og:locale: "no_NO"
- ✅ Twitter Card tags (summary) on all pages

### 4. **Structured Data (Schema.org JSON-LD)**
- ✅ **LocalBusiness Schema** (index.html)
  - Name, address (Torggata 8, Oslo, 0181)
  - Phone (+47 91921908)
  - Email (info@araratskredderi.no)
  - Opening hours
  - Ratings/aggregateRating
  - Social media links (sameAs)

- ✅ **Organization Schema** (index.html)
  - Founded: 1974
  - Founders information
  - Contact point

- ✅ **BreadcrumbList Schema** (all pages)
  - Hierarchical breadcrumbs for navigation
  - Page-specific positioning

- ✅ **ContactPoint Schema** (kontakt.html)
  - Contact type, telephone, email
  - Business address

### 5. **XML Sitemaps & Crawling**
- ✅ sitemap.xml created with:
  - All 6 pages listed
  - URLs: https://araratskredderi.no/[page]
  - lastmod: 2025-11-19
  - changefreq: weekly (home), monthly (internal), yearly (privacy)
  - priority: 1.0 (home), 0.9 (services/contact), 0.8 (about/gallery), 0.5 (privacy)

- ✅ robots.txt created with:
  - Allow all for User-agent: *
  - Crawl delays configured (Googlebot: 0, Bingbot: 1, others: 2)
  - Bot blocking: AhrefsBot, SemrushBot (prevent scrapers)
  - Sitemap reference

### 6. **Image Optimization**
- ✅ All images have descriptive alt text:
  - Gallery: 30 images with context-specific alt tags
  - Om-oss: 2 images (skreddersøm, interiør)
  - Index: 4 images (measuring, stoff, thread, etc.)
- ✅ Image file names are descriptive (araratmeasuring, stoff, etc.)
- ⏳ **Recommendation:** Implement lazy loading with `loading="lazy"` attribute

### 7. **Responsive Design**
- ✅ Viewport meta tag configured
- ✅ CSS media queries for mobile/tablet/desktop
- ✅ Mobile menu tested and working (no conflicts)
- ✅ Images scale properly without overflow

### 8. **Internal Linking**
- ✅ All pages linked in navigation
- ✅ Footer links on all pages (consistent)
- ✅ Personvern link in all footers
- ⏳ **Recommendation:** Add contextual internal links (e.g., services → gallery examples)

---

## 📄 Page-by-Page Status

### index.html (Homepage)
- ✅ Title: "Ararat Skredderi - Profesjonell Skreddersøm & Reparasjon i Oslo | 50+ År Erfaring"
- ✅ Meta description: Includes keywords, location, phone, 50 years experience
- ✅ Canonical: https://araratskredderi.no/
- ✅ OG tags: og:type="business.business"
- ✅ Schema: LocalBusiness + Organization (2 schemas)
- ✅ Images: 4 with alt text
- Status: **PRODUCTION READY**

### tjenester.html (Services)
- ✅ Title: "Tjenester - Skreddersøm, Reparasjon & Omforming | Ararat Skredderi Oslo"
- ✅ Meta description: All 6 services mentioned
- ✅ Canonical: https://araratskredderi.no/tjenester.html
- ✅ OG tags configured
- ✅ Schema: BreadcrumbList
- ✅ ARIA tabs for accessibility
- Status: **PRODUCTION READY**

### galleri.html (Gallery)
- ✅ Title: "Galleri - Skreddersøm & Håndverk Eksempler | Ararat Skredderi"
- ✅ Meta description: Portfolio/examples focus
- ✅ Canonical: https://araratskredderi.no/galleri.html
- ✅ OG tags configured
- ✅ Schema: BreadcrumbList
- ✅ 30 portfolio images with alt text
- Status: **PRODUCTION READY**

### om-oss.html (About)
- ✅ Title: "Om Oss - Ararat Skredderi | 50+ År Erfaring i Oslo"
- ✅ Meta description: History and values focus
- ✅ Canonical: https://araratskredderi.no/om-oss.html
- ✅ OG tags configured
- ✅ Schema: BreadcrumbList
- ✅ CSS fixes for mobile image overflow
- ✅ 2 images with alt text
- Status: **PRODUCTION READY**

### kontakt.html (Contact)
- ✅ Title: "Kontakt Ararat Skredderi - Ring +47 91 92 19 08"
- ✅ Meta description: Address, phone, CTA
- ✅ Canonical: https://araratskredderi.no/kontakt.html
- ✅ OG tags configured
- ✅ Schema: BreadcrumbList + ContactPoint
- ✅ Contact form present
- Status: **PRODUCTION READY**

### personvern.html (Privacy Policy)
- ✅ Title: "Personvern & Datavern - Ararat Skredderi"
- ✅ Meta description: GDPR/data protection focus
- ✅ Canonical: https://araratskredderi.no/personvern.html
- ✅ Meta robots: `noindex, follow` (legal page)
- ✅ OG tags configured
- ✅ Schema: BreadcrumbList
- ✅ 10 detailed GDPR-compliant sections
- Status: **PRODUCTION READY**

---

## 🚀 Pre-Launch Verification

Before connecting domain to araratskredderi.no, verify:

### DNS & Domain
- [ ] Domain registered: araratskredderi.no
- [ ] DNS A records configured to point to server IP
- [ ] SSL/TLS certificate obtained and installed (https://)
- [ ] www subdomain redirect configured (if desired)

### Search Engine Submission
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify site ownership (meta tag / file upload / DNS record)
- [ ] Configure preferred domain (www vs non-www)
- [ ] Set crawl rate preferences if needed

### Performance & Monitoring
- [ ] Test site speed with Google PageSpeed Insights
- [ ] Check mobile usability in Search Console
- [ ] Set up Google Analytics or Plausible Analytics
- [ ] Monitor 404 errors in Search Console
- [ ] Set up alerts for crawl errors

### Technical SEO
- [ ] Verify all internal links work (no 404s)
- [ ] Check robots.txt is accessible: /robots.txt
- [ ] Check sitemap is accessible: /sitemap.xml
- [ ] Validate HTML with W3C validator
- [ ] Test with Mobile-Friendly Test tool

### Content Review
- [ ] Verify all titles are unique and compelling
- [ ] Verify all descriptions are present and descriptive
- [ ] Check that no pages have duplicate content
- [ ] Review all images load properly
- [ ] Test contact form functionality

---

## 🔄 Ongoing SEO Tasks

### Monthly Maintenance
- Monitor Search Console for errors
- Check Analytics for traffic patterns
- Review and update content if needed
- Monitor ranking positions for target keywords

### Quarterly Updates
- Review and refresh image alt text
- Update schema markup with current business info
- Validate backlinks and referring domains
- Check competitor keyword strategies

### As-Needed
- Add new service pages with proper schema
- Create blog/resource content for link building
- Update business hours/contact info in schema
- Request links from relevant local directories

---

## 📊 Target Keywords & Focus Areas

**Primary Keywords:**
- Skreddersøm Oslo
- Skredder Oslo
- Reparasjon klær
- Skredderi
- Omforming klær

**Local Keywords:**
- Skreddersøm Torggata
- Skredder 0181 Oslo
- Reparasjon Grorud
- Skomakeri Oslo

**Long-tail Keywords:**
- Profesjonell skreddersøm dress Oslo
- Bukse forkortning Oslo
- Skjorte tilpasning Oslo
- Håndverk reparasjon klær

---

## 📋 Files & Resources

**SEO Configuration Files:**
- `/sitemap.xml` - XML sitemap for search engines
- `/robots.txt` - Crawler directives
- All `.html` files - Comprehensive meta tags and schema

**CSS & JavaScript:**
- `/css/style.css` - Responsive design
- `/js/script.js` - Preloader and animations (no page transitions interfering with indexing)

**Images:**
- `/images/` - All source images
- `/images/iloveimg-converted/` - Optimized gallery images (30 images)

---

## ✨ Summary

**Total Pages:** 6 (all optimized for SEO)  
**Total Images:** 36+ (all with alt text)  
**Schema Types:** LocalBusiness, Organization, BreadcrumbList, ContactPoint  
**Sitemap Entries:** 6 pages  
**Robots.txt:** Configured with crawler rules  

**Launch Readiness:** ✅ **100% COMPLETE**

All SEO fundamentals are in place. The site is production-ready and optimized for search engine visibility. Once the domain is connected to araratskredderi.no, the site will begin indexing and appearing in search results.

---

*Last Updated: 2025-11-19*
*Prepared for: araratskredderi.no domain launch*
