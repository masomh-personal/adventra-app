# Test Coverage Improvement TODOs

## Current Status (as of latest run)

- **Branches**: 80.29% ✅ **OVER 80%!**
- **Functions**: 79.9% (need +0.1% to reach 80%)
- **Statements**: 83.4%
- **Lines**: 84.37%

## Achievement Summary

🎉 **Branches target achieved!** (80.29% > 80%)
✅ Functions are at 99.9% of target (just 0.1% away from 80%)

## Recent Improvements

- **signup.tsx**: 45.45% → 63.63% branches (+18.18%)
- **messages.tsx**: 67.64% → 79.41% branches (+11.77%)
- **login.tsx**: 70.83% → 87.5% branches (+16.67%)
- **ModalContext**: 53.84% → 73.07% functions, 66.66% → 80% branches

## Future Improvements

### High Priority (Low Coverage Files)

1. **FormWrapper.tsx** (36.36% functions, 89.28% branches)
    - Test function-as-children pattern
    - Test custom component injection with form context
    - Test error handling in handleFormSubmit
    - **Impact**: Would significantly improve function coverage

2. **signup.tsx** (50% functions, 63.63% branches)
    - Test additional error branches (different error messages)
    - Test edge cases in form validation
    - Test error handling when error object doesn't have message property
    - **Impact**: Would improve both function and branch coverage

3. **edit-profile.tsx** (81.81% functions, 62.28% branches)
    - Test form validation branches
    - Test error handling branches
    - Test conditional rendering based on profile data
    - **Impact**: Would improve branch coverage significantly

4. **search.tsx** (66.66% functions, 68.75% branches)
    - Test search filtering branches
    - Test result display branches
    - Test empty state and error handling
    - **Impact**: Would improve both function and branch coverage

5. **dashboard.tsx** (60% functions, 83.33% branches)
    - Test additional function branches
    - Test error handling and edge cases
    - **Impact**: Would improve function coverage

### Medium Priority

6. **lib/withAuth.tsx** (0% coverage)
    - Test HOC authentication logic
    - Test redirect behavior when unauthenticated
    - Test component rendering when authenticated
    - **Note**: Currently excluded from coverage, but should be tested

7. **messages.tsx** (100% functions, 79.41% branches)
    - Test error handling in fetchMessages (line 96)
    - Test edge cases in conversation loading
    - **Impact**: Would improve branch coverage

8. **login.tsx** (80% functions, 87.5% branches)
    - Already well tested, minor improvements possible
    - **Status**: Good coverage achieved

### Infrastructure Improvements

9. **Coverage Thresholds**
    - Set coverage thresholds in `vitest.config.ts` to enforce 80% minimum
    - Add CI/CD check to fail builds below threshold
    - Document coverage goals in README
    - **Example**:
        ```typescript
        coverage: {
          thresholds: {
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80,
          },
        }
        ```

10. **Integration Tests**
    - Add integration tests for critical user flows:
        - Complete signup flow (form → validation → submit → success)
        - Login flow with error handling (invalid credentials, magic link)
        - Profile editing flow (load → edit → save → verify)
        - Messaging flow (conversations → messages → send)
    - Test cross-component interactions
    - Test authentication flow end-to-end
    - Use Playwright or Cypress for E2E testing

11. **Backend Migration: Evaluate Appwrite as Supabase Alternative**
    - Research and evaluate Appwrite as a replacement for Supabase
    - **Why Appwrite**:
        - Best "All-in-One" alternative (Auth + Database + Dashboard) like Supabase
        - **Free tier policy (late 2025)**: Projects are "Never paused" - stay online indefinitely
        - **Free tier limit**: 2 active projects (but they never get paused)
        - Excellent TypeScript/Node SDKs that fit perfectly with Next.js workflow
        - No need to "keep projects alive" or log in regularly
    - **Evaluation Tasks**:
        - Compare feature parity (Auth, Database, Storage, Realtime)
        - Evaluate migration effort (data migration, code changes)
        - Test Appwrite TypeScript SDK integration with Next.js
        - Compare pricing and limits (free tier vs paid)
        - Assess developer experience and documentation quality
        - Check community support and ecosystem
    - **Migration Considerations**:
        - Create proof-of-concept migration for one feature (e.g., Auth)
        - Estimate timeline and effort for full migration
        - Plan data migration strategy
        - Update environment variables and configuration
        - Update all Supabase client calls to Appwrite SDK
    - **Decision Criteria**:
        - Feature completeness for current needs
        - Migration complexity vs benefits
        - Long-term sustainability and pricing
        - Developer experience improvements

## Notes

- **Branches coverage**: ✅ Target achieved (80.29%)
- **Functions coverage**: Very close to target (79.9%, need +0.1%)
- Focus on low-hanging fruit first (files with lowest coverage)
- Consider refactoring complex components to improve testability
- Prioritize critical user flows for integration testing
- Most files are now at 80%+ coverage, excellent progress!

## Quick Wins to Push Functions Over 80%

Since functions are at 79.9% (just 0.1% away), even a small improvement to one file should push it over:

- **FormWrapper.tsx**: Adding function-as-children test would likely push functions over 80%
- **dashboard.tsx**: Adding one more function test would help
- **search.tsx**: Adding function tests would help
