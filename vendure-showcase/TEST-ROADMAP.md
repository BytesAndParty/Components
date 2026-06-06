# Vendure Showcase — Test Roadmap & Progress

Tracking the validation of the integration between AtelierUI (Design Engine) and Vendure (Commerce Backend).

---

## 📋 Ranking & Status

| Priority | Task | Status | Notes |
|---|---|---|---|
| **1** | **Integration: Custom Fields & GraphQL Mapping** | ✅ Done | Verified data flow and correct rendering via Integration Test. |
| **2** | **Commerce: Cart Sync & Optimistic UI** | ✅ Done | Tested rollback logic on stock-out or server errors with delayed mock. |
| **3** | **Performance: Hydration & FOUC Prevention** | ✅ Done | Validated `AtelierInitScript` DOM manipulation and FOUC prevention. |
| **4** | **Security: Render-Seams & Slug Validation** | ✅ Done | Verified XSS escaping in `WineText` and regex checks on slugs. |
| **5** | **Compliance: Label Validator (EU 2023/2977)** | ✅ Done | Audited missing/present fields matching EU regulations. |

---

## 🛠 Work Log

### [2026-06-06] Phase 1: Custom Fields Validation
- **Goal:** Ensure all 10+ wine attributes (jahrgang, rebsorte, etc.) are correctly typed and visible in the Shop API.
- **Implementation:** Create an integration test checking the GraphQL schema and component mapping.

---

## 📖 Test Definitions

### 1. Custom Fields & Mapping
- **Schema Check:** Does `upvoteWine` mutation exist? Are `customFields` on `Product` public?
- **Component Check:** Does `<WineDetail />` receive the correct types? Is `alkoholgehalt` a float?

### 2. Cart Rollback Logic
- **Scenario:** User increases quantity -> UI updates optimistically -> Server returns `INSUFFICIENT_STOCK`.
- **Expectation:** UI reverts to previous quantity and shows an error toast.

### 3. FOUC & Hydration
- **Scenario:** Page load on slow 3G.
- **Expectation:** Theme/Accent is applied immediately via `AtelierInitScript` (No white flash). Islands hydrate without jumping (CLS).
