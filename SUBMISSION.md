# Purelane Shopify Theme — Assignment Submission

## Dev Store

URL:
[https://purelane-development-520r8qha.myshopify.com?preview_theme_id=164271882461](https://purelane-development-520r8qha.myshopify.com?preview_theme_id=164271882461)

## GitHub

[https://github.com/Rarebuffalo/troopod-ai-product-engineer-assignment](https://github.com/Rarebuffalo/troopod-ai-product-engineer-assignment)

---

## Shopify Data Model

The following custom product metafields are defined and utilized in the theme code to drive dynamic card badges, short summary features, and bundle components:

### 1. `custom.card_badge`
*   **Namespace:** `custom`
*   **Key:** `card_badge`
*   **Type:** `single_line_text_field`
*   **Purpose:** Renders custom tags or highlight badges (e.g., `"Best seller"`, `"Top rated"`, `"New"`) above product cards in grids and lists.

### 2. `custom.product_summary`
*   **Namespace:** `custom`
*   **Key:** `product_summary`
*   **Type:** `single_line_text_field`
*   **Purpose:** Exposes short marketing taglines (e.g., `"Cuts grease instantly"`, `"Melts hard water stains"`) inside product listings.

### 3. `custom.included_products`
*   **Namespace:** `custom`
*   **Key:** `included_products`
*   **Type:** `list.product_reference`
*   **Purpose:** Binds constituent products to a parent Combo/Bundle product to dynamically overlay and stack component product images in visual grids.

### 4. `custom.combo_features`
*   **Namespace:** `custom`
*   **Key:** `combo_features`
*   **Type:** `list.single_line_text_field`
*   **Purpose:** Stores key selling bullet points for package product pages or combo rail listings.

---

## Build Notes

### What I flagged about the original prototype
*   **Static Layout vs. Dynamic Catalog**: The original prototype was a single hardcoded HTML file. Many sections assumed static counts, hardcoded image heights, and hardcoded descriptions that do not account for natural catalog variations (e.g. products without images, long product titles, or sold-out items).
*   **CSS Layout Vulnerabilities**: Elements like inline SVG product illustrations collapsed to `0` width on webkit/chromium when nested in certain flexible containers because they lacked explicit dimension ratios.
*   **Accessibility & Semantics**: SVG outline structures were not marked as hidden or decorative, leading to screen reader clutter, and heading tags did not follow an index hierarchy.

### What I changed and why
*   **Modular Liquid Sections**: Converted all static layouts into fully standalone Liquid sections with merchant-editable customizer settings.
*   **Flexible Section Schemas**: Built reusable blocks for reviews, ingredients, pillars, proof stats, and product rotator slides.
*   **Dynamic Data Bindings**: Connected bestsellers grids, range shelves, and combo lists to actual Shopify collections, prices, and metafields.
*   **Edge-Case Handlers**: Added checks for sold-out products (`Washing Machine Cleaner`), products with no images (`Magic Eraser`), and extremely long titles (`Grease Degreaser Spray`) to prevent container layout overflows.
*   **Rotator Javascript Class**: Ported the product slideshow into a structured Javascript class (`PurelaneRotator`) inside `purelane.js` running on IntersectionObserver to only rotate when visible inside the viewport.
*   **Schema Compliancy**: Shifted multiline parameters containing newlines from `inline_richtext` (which rejects HTML line breaks in defaults) to `textarea` configurations rendered via `newline_to_br`.

### What I would do with more time
*   **Mobile Touch Gestures**: Implement swipe gesture navigation on the product rotator slide card on touchscreen devices.
*   **AJAX Cart Integration**: Bind the "Add to Cart" CTA buttons on the homepage directly to the AJAX cart API drawer to prevent standard page redirects.

---

## AI Workflow

### What I delegated
*   **Bespoke SVG Porting**: Porting the complex raw SVG vectors of ingredients and product outline illustrations to conditional Liquid sections.
*   **CSS Class Namespace Migration**: Migrating raw HTML classes to namespaced Shopify classes (`.pl-sec`, `.pl-wrap`, `.pl-glass`, etc.) to prevent stylesheet leakage.
*   **Schema JSON Boilerplate**: Generating block/preset JSON structures for Shopify settings schemas.

### Where the agent failed
*   **Aspect Ratio Collapsing**: The agent initially ported inline SVGs without setting computed dimensional bounds, causing them to collapse on resizing viewports.
*   **Liquid Schema Validator Rule Violations**: The agent output `<br>` tags in `inline_richtext` defaults, causing Shopify theme pushes to error out.
*   **Syntax Errors in JSON updates**: Missing closing brackets during index template additions occasionally caused 500 compilation errors before validation.
*   **Playwright CDNs Driver Outage**: During Phase 5 verification, the browser subagent's Playwright context failed to download its drivers due to Playwright CDN outages.

### What I retained ownership of
*   **Architectural Strategy**: Mapping static grids to Shopify collection/product loops, metafield mappings, and deciding between section settings vs block variables.
*   **Validation & Debugging**: Running lint checks, investigating compilation errors, verifying Git trees, and validating responsive scales manually.

### What I would systematize for 20 similar projects
*   **Standardized Schema Templates**: Pre-configured JSON blueprints for common components (e.g. marquee rails, rotators, lists) to avoid manual markup translation.
*   **Automation Framework for Theme Testing**: Scripted CLI deployment triggers that push, check, and pull storefront states automatically.

---

## QA

The following quality assurance validations were successfully performed:
1.  **Shopify Theme Check**: Ran `npx shopify theme check` yielding **0 errors** on custom layout code.
2.  **Git Diff Validation**: Checked all modifications via `git diff --check` to ensure no whitespace, syntax, or merge artifacts exist.
3.  **Local Storefront Verification**: Probed local server compilation (returning `HTTP 200`).
4.  **Shopify-Hosted Storefront Preview**: Successfully pushed layout updates to preview theme ID `164271882461` for evaluation.

---

## Known Limitations

*   **Playwright Driver Environment Issue**: Automated subagent screenshot verification was blocked due to external Playwright CDN driver download outages.
*   **Password Page Redirection**: Non-interactive HTTP requests to preview URLs redirect to password verification pages for cookie security, requiring manual browser checks.
