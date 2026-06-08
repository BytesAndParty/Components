# Vendure Showcase — Test Roadmap & Progress

Tracking the validation of the integration between AtelierUI (Design Engine) and Vendure (Commerce Backend).

---

## 📋 Ranking & Status

| Priority | Task | Status | Notes |
|---|---|---|---|
| **1** | **Integration: Custom Fields & GraphQL Mapping** | ✅ Done | Verified data flow and correct rendering via Integration Test. |
| **2** | **Commerce: Cart Sync & Optimistic UI** | ✅ Done | Verified optimistic updates and rollback logic via Integration Test. |
| **3** | **Performance: Hydration & FOUC Prevention** | ✅ Done | Verified immediate theme application (FOUC) and hydration stability via E2E. |
| **4** | **Security: Render-Seams & Slug Validation** | ✅ Done | Verified XSS escaping and slug allow-listing via Unit Test. |
| **5** | **Compliance: Label Validator (EU 2023/2977)** | ✅ Done | Verified mandatory field validation via Unit Test. |

---

## 🛠 Work Log

### [2026-06-06] Phase 1: Custom Fields Validation
- **Goal:** Ensure all 10+ wine attributes (jahrgang, rebsorte, etc.) are correctly typed and visible in the Shop API.
- **Result:** Successfully implemented `wine-detail.test.tsx`. Mapping is correct.

### [2026-06-06] Phase 2: Cart & Optimistic UI
- **Goal:** Verify that the cart reacts instantly to changes and rolls back on server errors.
- **Result:** Implemented `cart.test.tsx`. Fixed a bug in `cart-context.ts` where the query client was not correctly accessed in mutations. Rollback confirmed.

### [2026-06-06] Phase 3: Performance & Hydration
- **Goal:** Ensure no FOUC and stable hydration with React 19.
- **Result:** Implemented `performance.test.tsx` (Unit) and `vendure-performance.test.ts` (E2E). Confirmed `AtelierInitScript` applies theme before hydration. No console errors found.

### [2026-06-06] Phase 4: Security Validation
- **Goal:** Verify XSS protection and safe routing.
- **Result:** Implemented `security.test.tsx`. Confirmed `WineText` escapes HTML and `isValidWineSlug` blocks common attack vectors (path traversal, protocols).

### [2026-06-06] Phase 5: Compliance Validation
- **Goal:** Ensure the Label Designer enforces EU mandatory fields.
- **Result:** Implemented `validator.test.ts`. Confirmed all mandatory fields (alcohol, volume, allergen, country, QR) are tracked with correct severity.

---

## 📖 Test Definitions

### 1. Custom Fields & Mapping
- **Schema Check:** Does `upvoteWine` mutation exist? Are `customFields` on `Product` public?
- **Component Check:** Does `<WineDetail />` receive the correct types? Is `alkoholgehalt` a float?

### 2. Cart Rollback Logic
- **Scenario:** User increases quantity -> UI updates optimistically -> Server returns `Error`.
- **Expectation:** UI reverts to previous quantity and shows an error toast (Toast test pending).

### 3. FOUC & Hydration
- **Scenario:** Page load on slow 3G.
- **Expectation:** Theme/Accent is applied immediately via `AtelierInitScript` (No white flash). Islands hydrate without jumping (CLS).
