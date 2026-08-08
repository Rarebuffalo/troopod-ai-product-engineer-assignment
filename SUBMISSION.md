# Purelane Shopify Theme — Assignment Submission

## Dev Store

Store URL:
[https://purelane-development-520r8qha.myshopify.com/](https://purelane-development-520r8qha.myshopify.com/)

Preview theme:
[https://purelane-development-520r8qha.myshopify.com/?preview_theme_id=164271882461](https://purelane-development-520r8qha.myshopify.com/?preview_theme_id=164271882461)

*Note: Access to the development storefront requires the shop password, which has been provided separately in the submission form.*

## GitHub

[https://github.com/Rarebuffalo/troopod-ai-product-engineer-assignment](https://github.com/Rarebuffalo/troopod-ai-product-engineer-assignment)

---

## Implementation Summary

All 13 visual sections from the original `purelane-homepage.html` prototype have been successfully converted to modular, merchant-editable Liquid sections. The sections compile under standard Shopify schemas and have been reordered inside `templates/index.json` to match the visual prototype's sequence exactly:

1.  **Hero** (`sections/purelane-hero.liquid`)
2.  **Reviews Marquee** (`sections/purelane-reviews.liquid`)
3.  **Ingredients Grid** (`sections/purelane-ingredients.liquid`)
4.  **Pillars / How it works** (`sections/purelane-pillars.liquid`)
5.  **Proof / Why it works** (`sections/purelane-proof.liquid`)
6.  **Best Selling Combos** (`sections/purelane-bundle-showcase.liquid`)
7.  **Build Your Bundle** (`sections/purelane-bundle-tiers.liquid`)
8.  **Shop / Bestsellers** (`sections/purelane-shop.liquid`)
9.  **Full Range Shelf** (`sections/purelane-range.liquid`)
10. **Why Bundles Grid** (`sections/purelane-benefits.liquid`)
11. **Bundle Categories** (`sections/purelane-bundle-categories.liquid`)
12. **Trust Bar** (`sections/purelane-trust-bar.liquid`)
13. **Signup Form** (`sections/purelane-signup.liquid`)

---

## Shopify Data Model

The following custom product metafields are defined and consumed by the storefront code to render dynamic badges and taglines:

### 1. `custom.card_badge`
*   **Namespace:** `custom`
*   **Key:** `card_badge`
*   **Type:** `single_line_text_field`
*   **Purpose:** Stores highlight tag flags (e.g., `"Best seller"`, `"Top rated"`, `"New"`) rendered above product cards.
*   **UI Consumer:** [snippets/purelane-product-card.liquid](file:///home/Krishna-Singh/purelane/snippets/purelane-product-card.liquid#L9)

### 2. `custom.product_summary`
*   **Namespace:** `custom`
*   **Key:** `product_summary`
*   **Type:** `single_line_text_field`
*   **Purpose:** Stores short marketing summaries displayed directly below product titles.
*   **UI Consumer:** [snippets/purelane-product-card.liquid](file:///home/Krishna-Singh/purelane/snippets/purelane-product-card.liquid#L10)

---

## Build Notes

### What I flagged about the original prototype
*   **Static Layout Assumptions**: The static prototype assumed fixed counts and hardcoded descriptions. We modified the layouts to handle natural catalog variations, such as sold-out products (`Copper Cleaner`), products missing images (`Magic Eraser`), and very long titles (`Grease Degreaser Spray`) to keep grid cards aligned.
*   **SVG Aspect-Ratio Collapse**: Inline SVG illustrations collapsed to `0` width in flexbox/grid containers on Webkit/Chromium browsers because they lacked explicit dimension ratios. We resolved this by calculating height variables dynamically inside Liquid loops.
*   **Accessibility Constraints**: Added `role="img"` and descriptive `aria-label` tags to visual SVGs while adding `aria-hidden="true"` to purely decorative assets.

### What I changed and why
*   **Modular Liquid Sections**: Converted the hardcoded HTML page layout into standalone Shopify sections with structured settings schemas.
*   **Custom Product Rotator**: Ported the product slideshow widget into a Javascript class (`PurelaneRotator`) running on an IntersectionObserver trigger so it only loops transitions when visible in the viewport.
*   **Multi-Line Schema Configurations**: Replaced `inline_richtext` setting types (which throw compilation errors on `<br>` tags) with `textarea` fields rendered via the `newline_to_br` filter.
*   **Dawn Namespace Prevention**: Namespaced all custom styling and scripts with a `.pl-` prefix to prevent style bleeding into default Dawn cart drawers and sub-pages.

### What I would do with more time
*   **Mobile Touch Swipe**: Add drag/swipe gesture support to the product rotator slideshow cards.
*   **AJAX Drawer Cart Integration**: Bind homepage "Add to Cart" CTAs directly to Dawn's core AJAX cart drawer rather than standard page redirects.

---

## AI Workflow

### What I delegated
*   **Repetitive Template Porting**: Porting repetitive structural HTML elements and inline SVG illustration coordinates into Shopify Liquid templates.
*   **CSS Class Namespace Migration**: Appending namespaced prefixes to class chains to isolate styling.

### Where the agent failed
*   **Playwright CDN Driver Outage**: During preview audits, the subagent was unable to perform automated screenshot verification due to an external Playwright CDN zip download timeout (HTTP 404).
*   **JSON Syntax Errors**: The agent omitted array closing brackets during index template merges, leading to brief local storefront compilation errors before detection.
*   **Liquid Schema Rule Breakers**: Outputting `<br>` tags in `inline_richtext` defaults which triggered theme push schema validation errors.

### What I retained ownership of
*   **Architectural Strategy**: Planning schema configurations, mapping data components (such as resolving dynamic card badges vs static reviews blocks), and structuring scripts lifecycle.
*   **Manual Storefront Audits**: Inspecting the storefront preview layout visually across multiple mobile/desktop viewports and checking console error stacks.

### What I would systematize for 20 similar projects
*   **Standardized Schema Templates**: Creating pre-configured configuration skeletons for common sections (rotators, sliders, grids).
*   **Automated Validation Actions**: Adding pre-commit hooks that run `shopify theme check` and lint cleanups automatically before pushing branch updates.

---

## QA

The following checks were completed to verify theme integrity:
*   **Shopify Theme Check**: Ran validator checks showing **0 errors** on the custom layout code.
*   **Git Diff Integrity**: Verified no trailing whitespace or check artifacts exist via `git diff --check`.
*   **Manual Storefront Preview testing**: Checked page rendering, scroll reveal animations, and form signups across viewports from `375px` to `1440px`.

---

## Known Limitations

*   **Playwright Driver Installation**: Automated verification checks were constrained by the Playwright driver repo timeout issue, requiring manual visual tests.
*   **Preview Redirection**: Direct preview URL calls require cookie session authentication, requiring manual credential entry by the evaluator.
