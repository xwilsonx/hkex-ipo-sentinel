# Task: Connect PDF Upload Frontend to Backend and Enhance Response

- [x] Explore codebase
    - [x] Analyze `hkex-ipo-sentinel/src/components/AdminScreen.tsx` <!-- id: 0 -->
    - [x] Analyze `hkex-ipo-sentinel-python/pdf_processor/api/routes.py` <!-- id: 1 -->
    - [x] Check for shared types or API client structures <!-- id: 2 -->
- [x] Create Implementation Plan <!-- id: 3 -->
- [x] Backend Implementation <!-- id: 4 -->
    - [x] Update `/upload-pdf` endpoint in `routes.py` to return ToC and file details <!-- id: 5 -->
    - [x] Verify backend changes with existing tests or new tests <!-- id: 6 -->
- [x] Frontend Implementation <!-- id: 7 -->
    - [x] Update `AdminScreen.tsx` to integrate with `/upload-pdf` <!-- id: 8 -->
    - [x] Display ToC and file list from the response <!-- id: 9 -->
    - [x] Auto-download section on ToC click <!-- id: 12 -->
- [ ] Verification <!-- id: 10 -->
    - [ ] Run verification script <!-- id: 11 -->
    - [ ] Install Playwright <!-- id: 13 -->
    - [ ] Create E2E test for Download button <!-- id: 14 -->
    - [ ] Run Playwright test <!-- id: 15 -->
