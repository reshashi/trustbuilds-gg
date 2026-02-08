# PRD: Expand Parts Database & Add Parts Management

## 1. Executive Summary
Massively expand the TrustBuilds.gg component database from ~40 parts to 200+ parts across all 12 categories (CPU, GPU, motherboard, RAM, storage, PSU, case, cooler, monitor, keyboard, mouse, headset) by scraping real product data from PCPartPicker. Additionally, build an admin tool to add/edit parts going forward, similar to PCPartPicker's architecture for maintaining a living parts database.

## 2. Goals & Success Criteria
- [x] 200+ components in the database across all 12 categories (205 total)
- [x] Each category has at least 8-15 options spanning budget to premium
- [x] Admin page at /admin/parts to browse and manage components
- [x] All existing pages (builds, budget, upgrade) work with expanded data
- [x] `npm run build` passes with no type errors
- [x] Upgrade Advisor typeahead shows rich results across all categories

## 3. Technical Requirements

### Files to Create
- `app/admin/parts/page.tsx` - Admin UI for managing parts
- `data/parts/cpus.json` - Expanded CPU database
- `data/parts/gpus.json` - Expanded GPU database
- `data/parts/motherboards.json` - Expanded motherboard database
- `data/parts/ram.json` - Expanded RAM database
- `data/parts/storage.json` - Expanded storage database
- `data/parts/psus.json` - Expanded PSU database
- `data/parts/cases.json` - Expanded case database
- `data/parts/coolers.json` - Expanded cooler database
- `data/parts/monitors.json` - Expanded monitor database
- `data/parts/keyboards.json` - Expanded keyboard database
- `data/parts/mice.json` - Expanded mouse database
- `data/parts/headsets.json` - Expanded headset database
- `lib/partsLoader.ts` - Utility to load and merge all parts files

### Files to Modify
- `lib/data.ts` - Use new partsLoader instead of single components.json
- `data/components.json` - Will be replaced by per-category files
- `app/upgrade/page.tsx` - Import from new data source

### Dependencies
- None (pure static JSON approach)

## 4. Implementation Approach

### Worker Task Breakdown

#### Worker 1: parts-data
- **Task**: Research and create comprehensive parts database with 200+ components across all 12 categories. Use PCPartPicker-style pricing and specs.
- **Owns**: `data/parts/*.json`, `lib/partsLoader.ts`
- **Off-limits**: `app/`, `components/`
- **Depends on**: none

#### Worker 2: admin-ui
- **Task**: Build admin page for adding/editing/deleting parts
- **Owns**: `app/admin/parts/page.tsx`
- **Off-limits**: `data/parts/`
- **Depends on**: parts-data (needs to know schema)

#### Worker 3: integration
- **Task**: Update lib/data.ts and all pages to use new parts loader
- **Owns**: `lib/data.ts`, `app/upgrade/page.tsx`, `app/budget/page.tsx`
- **Off-limits**: `data/parts/`
- **Depends on**: parts-data

## 5. Verification Plan
- [x] `npm run build` passes
- [x] Homepage loads with all builds (7 builds, all component IDs resolve)
- [x] Upgrade Advisor shows 8+ options per category when typing
- [x] Budget Builder works correctly
- [x] Admin page loads and can display all 205 parts
- [x] Each category has at least 8 components (min: 12 keyboards, max: 25 CPUs/GPUs)

## 6. Execution Status

### Current State
- **Phase**: COMPLETE
- **Iteration**: 1 of 3
- **Started**: 2026-02-08T00:00:00Z
- **Last Updated**: 2026-02-08T00:00:00Z

### Phase Checklist
- [x] Phase 1: PRD Generation
- [x] Phase 2: Implementation Started
- [x] Phase 3: Implementation Complete
- [x] Phase 4: Review Complete
- [x] Phase 5: Quality Gates Passed
- [x] Phase 6: Deliverables Generated
- [x] Phase 7: Project Complete

### Success Criteria Results
- [x] 205 components in the database across all 12 categories
- [x] Each category has at least 8-15 options spanning budget to premium
- [x] Admin page at /admin/parts to browse and manage components
- [x] All existing pages (builds, budget, upgrade) work with expanded data
- [x] `npm run build` passes with no type errors
- [x] Upgrade Advisor typeahead shows rich results across all categories
- [x] All 7 build component IDs resolve correctly
- [x] Old components.json removed (replaced by per-category files)

### Blockers & Issues
- None

### Quality Gate Results
- [x] Build passes: ✓ (all 16 pages generated)
- [x] All build IDs resolve: ✓ (7/7 builds verified)
- [x] Category coverage: ✓ (12/12 categories, all 8+ parts)
- [x] Code review: Deduplicated utility functions, fixed empty retailers edge case
- [x] Orphaned data/components.json removed

### Backlog Items Added
- None

### Log
- 2026-02-08 Project created
- 2026-02-08 Beginning implementation
- 2026-02-08 Created 12 per-category JSON files with 205 total parts
- 2026-02-08 Created lib/partsLoader.ts
- 2026-02-08 Created app/admin/parts/page.tsx
- 2026-02-08 Remapped all 7 builds to new part ID format
- 2026-02-08 Integrated partsLoader into lib/data.ts, upgrade, budget, admin pages
- 2026-02-08 Verified all builds resolve, build passes
- 2026-02-08 Removed orphaned data/components.json
- 2026-02-08 Code review: deduplicated getLowestPrice/formatPrice across 4 files
- 2026-02-08 Fixed empty retailers edge case in getLowestPrice
- 2026-02-08 All quality gates passed, project complete
