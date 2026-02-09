# Playwright Verification Plan

## Goal
Verify the existence and functionality of the "Download" button on the Admin Portal using Playwright.

## Proposed Changes

### 1. Dependencies
- Install `@playwright/test` in `hkex-ipo-sentinel`.
- Install Playwright browsers (Chromium).

### 2. Test Assets
- Generate a valid minimal PDF file (`test_document.pdf`) using Python (`pymupdf`) in the backend environment.

### 3. Test Script (`hkex-ipo-sentinel/tests/test_download_button.spec.ts`)
- Navigate to the Admin Portal URL (http://localhost:5173).
- Upload `test_document.pdf`.
- Wait for the "Extraction Results" section.
- Verify that a button with text "Download" exists.
- Verify that a button with text "Preview" exists.

## Verification
- Start Backend: `python -m uvicorn ...` (Already running).
- Start Frontend: `npm run dev` in `hkex-ipo-sentinel`.
- Run Test: `npx playwright test` or `npx playwright test tests/test_download_button.spec.ts`.
