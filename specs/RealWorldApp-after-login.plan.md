# RealWorldApp Post-Login Test Plan

## Application Overview

Test plan for RealWorldApp focusing on user functionality after a successful login using the seeded session (tests/seed.spec.ts) and the `loginPage` fixture. Covers main feed interactions, create/edit flows, navigation, filters, negative validation, session persistence and accessibility checks. All scenarios assume a fresh browser state with the seeded authenticated user.

## Test Scenarios

### 1. RealWorldApp - Post-Login Flows

**Seed:** `tests/seed.spec.ts`

#### 1.1. Feed Loads & Primary Navigation

**File:** `specs/tests/realworld/feed-and-navigation.spec.md`

**Steps:**
  1. Start from a fresh browser state and run the seeded login from `tests/seed.spec.ts`.
  2. Navigate to the app root (`/`).
  3. Verify the header/banner is visible and shows the app logo and `New` button.
  4. Verify tabs `Everyone`, `Friends`, `Mine` are present and the `Everyone` tab is selected by default.
  5. Click each tab (`Friends`, `Mine`) and verify the feed updates accordingly.
  6. Open the drawer (if present) and confirm primary side navigation items: `Home`, `My Account`, `Bank Accounts`, `Notifications`, `Logout`.
  7. Click `Home` and confirm feed view is shown again.

**Expected Results:**
  - Assumptions: seed login succeeded and user is authenticated.
  - Success criteria: header, tabs and side navigation render; tabs switch feed content; `Home` navigates to feed.
  - Failure conditions: missing header elements, tabs not responding, or feed not updating.

#### 1.2. Create New Transaction (Happy Path)

**File:** `specs/tests/realworld/create-transaction.spec.md`

**Steps:**
  1. From an authenticated seeded state, click the `New` button in the banner.
  2. Fill the `New Transaction` form: choose counterparty (or enter name), set amount (valid positive number), add a note, select Date and Privacy (Public).
  3. Submit the form.
  4. Verify successful creation notification (toast) or that the new transaction appears at top of the feed with correct name, note and amount.
  5. Open the created transaction's details (click the list item) and verify all fields match the submitted values.

**Expected Results:**
  - Assumptions: `New` opens a creation form and the app persists new transactions in the feed.
  - Success criteria: new transaction appears in feed with correct details and accessible via details view.
  - Failure conditions: validation errors for valid inputs, no new item in feed, or mismatched values in details view.

#### 1.3. Create Transaction - Validation Errors (Negative)

**File:** `specs/tests/realworld/create-transaction-negative.spec.md`

**Steps:**
  1. From authenticated seeded state, click `New` to open the creation form.
  2. Enter invalid values: empty counterparty, negative amount, excessively long note (>512 chars), and submit.
  3. Observe inline validation messages and form behavior.
  4. Try submitting with amount=0 and confirm validation prevents creation.

**Expected Results:**
  - Assumptions: form shows client-side validation for required fields and amount bounds.
  - Success criteria: form shows clear validation messages and prevents submission for invalid inputs.
  - Failure conditions: form accepts invalid data or shows generic/unhelpful errors.

#### 1.4. Filters: Date and Amount Range

**File:** `specs/tests/realworld/filters.spec.md`

**Steps:**
  1. From authenticated seeded state, locate the `Date: ALL` and `Amount: $0 - $1,000` filter controls.
  2. Open the `Date` filter and select a restricted range (e.g., last 7 days).
  3. Open the `Amount` filter and set a range that excludes many items (e.g., $1000 - $5,000).
  4. Apply filters and verify feed updates to reflect the selected filters.
  5. Clear filters and verify feed returns to unfiltered state.

**Expected Results:**
  - Assumptions: filters are applied client-side or server-side and alter the feed results.
  - Success criteria: feed reflects filter selections correctly; clearing returns original results.
  - Failure conditions: filters do not change results, or UI misrepresents the active filter state.

#### 1.5. View Transaction Details & Actions

**File:** `specs/tests/realworld/view-transaction.spec.md`

**Steps:**
  1. From feed, click a transaction list-item to open the details view (modal or separate page).
  2. Confirm details: payer/payee name, note, amount, date, and any action buttons/icons (like, comment, share).
  3. If action buttons exist, perform one (e.g., open comment box) and verify UI responds.
  4. Close details view and confirm focus returns to feed.

**Expected Results:**
  - Assumptions: each list item is clickable and exposes a details view with full transaction data.
  - Success criteria: details display matches list summary; in-details actions open expected UI.
  - Failure conditions: detail view missing fields, actions non-functional, or focus lost after close.

#### 1.6. My Account — Edit Profile Flow

**File:** `specs/tests/realworld/edit-profile.spec.md`

**Steps:**
  1. From side navigation click `My Account`.
  2. Open profile edit form (or inline edit) and change a visible field (e.g., display name).
  3. Save changes and confirm success notification if available.
  4. Return to header/profile area and verify updated display name appears.
  5. Reload page to ensure change persisted across sessions.

**Expected Results:**
  - Assumptions: `My Account` exposes editable user profile fields and persistence backend is available.
  - Success criteria: changes saved and reflected in header/profile and persist after reload.
  - Failure conditions: edits not saved, UI shows stale values, or save returns server error.

#### 1.7. Bank Accounts — Add & Validation

**File:** `specs/tests/realworld/bank-accounts.spec.md`

**Steps:**
  1. Click `Bank Accounts` in side navigation.
  2. Open `Add Bank Account` (or equivalent) form.
  3. Enter valid account details and submit; verify the new bank account appears in the list.
  4. Attempt to add an account with invalid data (missing account number or invalid routing) and verify inline validation prevents submission.
  5. Delete the newly created test account (cleanup) if deletion is supported.

**Expected Results:**
  - Assumptions: Bank Accounts feature exists and supports create/delete operations.
  - Success criteria: valid accounts created, invalid attempts blocked, and cleanup removes test data.
  - Failure conditions: silent failures, missing validation, or inability to remove test data.

#### 1.8. Notifications Panel & Mark-as-Read

**File:** `specs/tests/realworld/notifications.spec.md`

**Steps:**
  1. Click `Notifications` from side navigation or header.
  2. Verify list of notifications (or empty state) appears.
  3. If notifications exist, click the first notification and verify the app navigates to the related item.
  4. Use `Mark as read` (if available) and confirm the notification state updates and unread counter (if present) decrements.

**Expected Results:**
  - Assumptions: notifications surface events and support mark-as-read behavior.
  - Success criteria: notifications load, navigation works, and read/unread state updates correctly.
  - Failure conditions: notifications not loading, clicks produce no navigation, or unread counters not updating.

#### 1.9. Session Persistence & Logout

**File:** `specs/tests/realworld/session-and-logout.spec.md`

**Steps:**
  1. With seeded authenticated session, reload the page and verify the user remains logged in and feed is visible.
  2. Open a new tab (or browser window) and navigate to the app URL; verify the session is active there as well (if app uses cookies/sessions).
  3. Click `Logout` from side navigation and verify the app redirects to the login screen and authenticated pages become inaccessible.
  4. After logout, navigate back to protected routes and confirm redirection to login.

**Expected Results:**
  - Assumptions: seeded login creates a persistent session (cookie/localStorage) for the test user.
  - Success criteria: session survives reloads until explicit logout; logout clears session and protected pages require login.
  - Failure conditions: session unexpectedly expires, or logout does not clear access.

#### 1.10. Performance / Load Smoke (Feed Rendering)

**File:** `specs/tests/realworld/performance-smoke.spec.md`

**Steps:**
  1. From authenticated seeded state, measure time from page load to feed renderable state (document ready + feed visible).
  2. Scroll through the first 3 pages (or large feed sections) and observe UI responsiveness and any rendering jank.
  3. Record any obvious slow network calls or failing resources.

**Expected Results:**
  - Assumptions: test is a smoke/perf check, not a benchmark.
  - Success criteria: feed renders within acceptable threshold (e.g., <3s in CI-like environment); scrolling is smooth and no blocking JS errors in console.
  - Failure conditions: severe UI jank, long blocking loads, or console errors.

#### 1.11. Accessibility — Keyboard Navigation to Primary Controls

**File:** `specs/tests/realworld/accessibility.spec.md`

**Steps:**
  1. From a fresh authenticated state, use only keyboard (Tab/Shift+Tab/Enter) to navigate to: `New` button, first feed item, `My Account`, and `Logout`.
  2. Confirm each control receives focus in a logical order and is operable with Enter/Space.
  3. Check that focus is visible and that closing modals returns focus to a meaningful element.

**Expected Results:**
  - Assumptions: keyboard focus styles are present and controls are accessible via keyboard.
  - Success criteria: primary actions reachable and operable by keyboard; focus order is logical.
  - Failure conditions: controls not focusable, missing visible focus indicator, or keyboard-only users cannot complete primary flows.
