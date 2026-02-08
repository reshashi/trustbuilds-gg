# PRD: TrustBuilds.gg Product Feedback Fixes

## 1. Executive Summary

Address user feedback to improve the TrustBuilds.gg site. Key issues include inaccurate pricing display, broken affiliate links, unclear Trust Score labeling, mobile readability issues, confusing "Easy/Medium/Hard" build labels, and the Ultra 4K build needing better components.

## 2. Goals & Success Criteria

- [ ] Pricing displays correctly (calculated from actual component data)
- [ ] Affiliate links work and open correct retailer pages
- [ ] Trust Score badge clearly labeled (e.g., "Trust Score: 88")
- [ ] Component names readable on mobile (no cutoff)
- [ ] Build difficulty labels replaced with clearer terminology
- [ ] Ultra 4K build upgraded with premium components

## 3. Technical Requirements

### Files to Modify

- `components/BuildCard.tsx` - Fix difficulty labels, add Trust Score label
- `components/TrustScore.tsx` - Add "Trust Score" label to badge
- `components/ComponentList.tsx` - Fix mobile text truncation
- `components/RetailerPriceTable.tsx` - Verify affiliate links work
- `data/builds.json` - Update Ultra 4K build components
- `data/components.json` - Verify pricing data is accurate
- `app/builds/[slug]/page.tsx` - Fix difficulty terminology

### Dependencies
- None needed

## 4. Implementation Approach

### Simple Implementation
This is a straightforward fix across multiple files:

1. Fix Trust Score display - add "Trust Score:" label
2. Fix difficulty labels - change "Easy/Medium/Hard Build" to performance tier labels
3. Fix mobile component name truncation
4. Verify and fix affiliate links
5. Upgrade Ultra 4K build components
6. Verify pricing calculations are correct

## 5. Verification Plan

- [ ] Trust Score shows "Trust Score: XX" format
- [ ] Build cards show clear performance tier instead of difficulty
- [ ] Component names don't truncate on mobile (test at 375px width)
- [ ] All "Buy" links open correct retailer pages
- [ ] Ultra 4K build has RTX 4090 and top-tier CPU
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## 6. Execution Status

### Current State
- **Phase**: IMPLEMENTING
- **Iteration**: 1 of 3
- **Started**: 2026-02-08T20:30:00Z
- **Last Updated**: 2026-02-08T20:30:00Z

### Phase Checklist
- [x] Phase 1: PRD Generation
- [x] Phase 2: Implementation Started
- [ ] Phase 3: Implementation Complete
- [ ] Phase 4: Review Complete
- [ ] Phase 5: Quality Gates Passed
- [ ] Phase 6: Deliverables Generated
- [ ] Phase 7: Project Complete

### Blockers & Issues
- None yet

### Quality Gate Results
- [ ] `/review`: pending
- [ ] `/qcode`: pending
- [ ] Security scan: pending
- [ ] Critical issues fixed: N/A

### Backlog Items Added
- None yet

### Log
- 2026-02-08T20:30:00Z Project created
- 2026-02-08T20:30:00Z Implementation started
