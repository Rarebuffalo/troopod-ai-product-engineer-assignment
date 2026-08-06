# Purelane Shopify Data Model

This document outlines the Shopify data architecture, product catalog specifications, metafield schemas, and section relationships designed for the Purelane Plant-Based Homecare theme implementation.

---

## 1. Product Catalog Specifications

The development store is seeded with at least **8 products**. Product names, media, pricing, and availability are fetched dynamically from the Shopify database.

### Catalog Seed Mapping

| Product Name | Handle | Base Price | Compare-At | Inventory | Used in Section | Design/Edge Case Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tap Cleaner & Limescale Remover** | `tap-cleaner` | ₹200 | ₹299 | 100 | Hero, Shop, Combos, Bundles | Standard product (33% off) |
| **Kitchen Cleaner, Foaming** | `kitchen-cleaner` | ₹200 | ₹299 | 150 | Hero, Shop, Combos, Bundles | Standard product (33% off) |
| **Copper, Bronze & Brass Cleaner** | `copper-cleaner` | ₹200 | ₹299 | 0 (Out) | Hero, Shop, Combos | **Edge Case A: SOLD OUT** |
| **Washing Machine Cleaner & Descaler** | `washing-machine-cleaner` | ₹200 | ₹299 | 80 | Shop, Combos, Bundles | Standard product |
| **Floor Cleaner, Natural Herbal** | `floor-cleaner` | ₹250 | ₹349 | 200 | Shop, Combos, Bundles | Standard product |
| **Organic Dishwash Liquid Gel** | `dishwash-gel` | ₹180 | ₹249 | 120 | Shop, Combos, Bundles | Standard product |
| **Magic Eraser Scrubber Pack** | `magic-eraser` | ₹150 | - | 50 | Shop, Combos, Bundles | **Edge Case B: NO IMAGE** |
| **Purelane Foaming Kitchen and Heavy-Duty Multi-Surface Grease Degreaser Spray** | `heavy-duty-degreaser` | ₹280 | ₹399 | 90 | Shop | **Edge Case C: VERY LONG TITLE** |

---

## 2. Metafields Schema

To capture specialized presentation values, we use the following namespaces:

### Product Metafields (`custom` namespace)

#### 1. `custom.card_badge`
*   **Type:** Single line text
*   **Description:** Renders custom tags/badges in grids or listings.
*   **Values:** `"Best seller"`, `"Top rated"`, `"New"`.

#### 2. `custom.product_summary`
*   **Type:** Single line text
*   **Description:** Short marketing highlight taglines.
*   **Values:** `"Cuts grease instantly"`, `"Melts hard water stains"`.

#### 3. `custom.included_products`
*   **Type:** List of product references
*   **Description:** Binds constituent products to a parent Combo/Bundle product to dynamically stack product images.
*   **Values:** List of product handles.

#### 4. `custom.combo_features`
*   **Type:** List of single line texts
*   **Description:** Custom key selling points to display as features list.
*   **Values:** e.g., `"Pick any three products"`, `"Covers kitchen and laundry"`.

### Metafield Decisions Summary
*   **Ingredients Metafield (`custom.ingredients`):** **REMOVED**. The ingredients display on the homepage is static brand storytelling and does not vary per-product in the required sections.
*   **Savings Metafield (`custom.saving_percentage`):** **REMOVED**. All discounts and percentage banners are calculated dynamically in Liquid:
    *   *Percentage:* `{{ product.compare_at_price | minus: product.price | times: 100.0 | divided_by: product.compare_at_price | round }}% off`
    *   *Amount:* `Save {{ product.compare_at_price | minus: product.price | money }}`

---

## 3. Section Data Architectures

### Hero Section Slider
*   **Mechanism:** Section settings contain customizable slides. Each slide represents a product package structure:
    *   **Slide 1 (Single):** References 1 Product (e.g., Kitchen Cleaner). Price card displays title `"Single bottle"` and its real price.
    *   **Slide 2 (Duo):** References 2 Products (e.g., Tap Cleaner & Kitchen Cleaner). Price card displays title `"Any 2 products"`.
    *   **Slide 3 (Trio):** References 3 Products (e.g., Tap, Copper, Kitchen). Price card displays title `"Any 3 products"`.
*   **Assets:** Dynamic product media renders instead of base64 SVGs.

### Shop / Product Grid
*   **Mechanism:** Controlled via a single Collection reference (e.g. `Bestsellers` or `All`).
*   **Theme Customizer settings:** Merchant selects the collection, columns count, and whether to show cards with badges/summaries.

### Best-Selling Combos Rail
*   **Mechanism:** Blocks of type `combo_product`.
*   **Block Fields:**
    *   Product selector (points to a Combo Product containing title, description, price).
    *   Custom badge (e.g., `"Most popular"`, `"Best value"`).
*   **Rendering:** The stack of constituent products is dynamically queried from the product's `custom.included_products` list references.

### Bundles Picker
*   **Mechanism:** Blocks of type `bundle_tier`.
*   **Block Fields:**
    *   Product selector (Starter Bundle, Most Popular, Whole Home).
    *   Custom tier tag (e.g., `"Starter"`, `"Most popular"`, `"Whole home"`).
    *   Features list override.

### Reviews Rail
*   **Mechanism:** Blocks of type `review`.
*   **Block Fields:**
    *   Author name (`author`)
    *   Stars rating (`rating` range 1-5)
    *   Review title (`title`)
    *   Review text (`body`)
    *   Product reviewed label (`product_label`)
*   **Justification:** Kept self-contained as section blocks. Allows instant editing, additions, or re-ordering without database bloat or third-party review application overhead.
