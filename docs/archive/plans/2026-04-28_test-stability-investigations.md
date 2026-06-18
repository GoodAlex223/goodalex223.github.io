# Test Stability Investigations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve two long-standing Playwright flakes — Firefox tabindex update (`tests/filter/accessibility.spec.js:44`) and WebKit loading state (`tests/form/submission.spec.js:36`) — by applying a structural fix to WebKit and an evidence-driven fix-or-quarantine to Firefox.

**Architecture:** Add a deferred-promise route helper to the `FormPage` POM and use it to eliminate the WebKit fixed-timeout race. For Firefox, add temporary `page.evaluate()` instrumentation to the failing test, run with `--repeat-each=50` to capture failure traces, then apply one of three pre-defined fixes (or quarantine via `test.fixme()` if root cause is inconclusive). Single PR with five-to-six logical commits depending on Firefox outcome.

**Tech Stack:** Playwright (web-first assertions, route mocks, `test.fixme()`, `test.info().attach()`), ES modules.

**Spec:** `docs/archive/specs/2026-04-28_test-stability-investigations-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `tests/pages/FormPage.js` | Modify | Add `mockFormspreeDeferred()` helper |
| `tests/form/submission.spec.js` | Modify | Migrate `"shows loading state during submission"` test to deferred helper |
| `tests/filter/accessibility.spec.js` | Modify | Add temporary instrumentation; then either apply targeted fix or `test.fixme()` quarantine |
| `docs/planning/BACKLOG.md` | Modify | Close (or update with findings) the two flake entries at lines 854 and 865 |

---

## Decision tree summary

The Firefox investigation is decision-driven. Tasks 4–6 branch on the diagnosis output from Task 4. Each branch is fully written below — no placeholders.

```
Task 1: Add mockFormspreeDeferred helper            (always)
Task 2: Migrate WebKit loading-state test           (always)
Task 3: Add Firefox instrumentation                 (always)
Task 4: Reproduce + capture diagnosis               (always)
        ├─ Diagnosis = INIT_RACE        → Task 5a
        ├─ Diagnosis = CLICK_NOT_LANDED → Task 5b
        ├─ Diagnosis = REFLECTION_LAG   → Task 5c
        └─ Diagnosis = INCONCLUSIVE     → Task 5d (quarantine)
Task 6: Remove instrumentation                      (only if Task 5a/5b/5c)
Task 7: Update BACKLOG entries                      (always; content depends on outcome)
Task 8: Final cross-engine validation               (always)
```

---

### Task 1: Add `mockFormspreeDeferred()` helper to `FormPage` POM

**Files:**
- Modify: `tests/pages/FormPage.js:79-105` (Formspree mocking section)

- [ ] **Step 1: Add the new helper after `mockFormspreeNetworkError()`**

Open `tests/pages/FormPage.js`. Locate the existing `mockFormspreeNetworkError()` method (currently around line 101–105). Add the following new method directly after it, before the `// ── Assertions ───` divider comment:

```js
  /**
   * Mock Formspree with a deferred response. Returns a release function that
   * resolves the response when the test calls it. Use to assert intermediate
   * states (e.g., loading state) without a fixed-timeout race.
   *
   * Always call the returned release function before assertions that wait on
   * the response, otherwise the test will hang until Playwright's per-test
   * timeout fires.
   *
   * @param {{ status?: number, body?: object }} [options]
   * @returns {() => void} releaseRoute — call to send the response
   */
  async mockFormspreeDeferred({ status = 200, body = { ok: true } } = {}) {
    let releaseRoute;
    const released = new Promise((resolve) => { releaseRoute = resolve; });
    await this.page.route("**/formspree.io/f/*", async (route) => {
      await released;
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
    return releaseRoute;
  }
```

- [ ] **Step 2: Lint to verify no syntax errors**

Run: `npm run lint:js`
Expected: no errors. If ESLint complains about an unused `releaseRoute` declaration, that is a false positive — the assignment inside the Promise constructor is used. If it errors, restructure as `const releaseRoute = await new Promise(resolve => { ... })` would *not* work because the route handler closes over the resolve function. The current shape is correct.

- [ ] **Step 3: Commit**

```bash
git add tests/pages/FormPage.js
git commit -m "test: Add mockFormspreeDeferred helper to FormPage POM"
```

---

### Task 2: Migrate WebKit loading-state test to deferred helper

**Files:**
- Modify: `tests/form/submission.spec.js:36-55`

- [ ] **Step 1: Replace the test body**

Open `tests/form/submission.spec.js`. Replace the entire `"shows loading state during submission"` test (lines 36–55) with:

```js
  test("shows loading state during submission", async () => {
    // Deferred-promise route control: response is held until the test
    // releases it, so loading-state assertions have unbounded time to land.
    // Replaces the previous fixed 500ms setTimeout that flaked on WebKit
    // when click→assert overhead exceeded the response window.
    const releaseRoute = await fp.mockFormspreeDeferred();

    await fp.fillAllFields();
    await fp.clickSubmit();
    await fp.expectLoadingState();
    await fp.expectSubmitDisabled();

    releaseRoute();

    await fp.expectSuccess();
    await fp.expectSubmitEnabled();
  });
```

- [ ] **Step 2: Run the migrated test on WebKit (single run)**

Run: `npx playwright test tests/form/submission.spec.js -g "loading state" --project=webkit --workers=1`
Expected: 1 passed (1 total). Test completes in well under 5s.

- [ ] **Step 3: Stress-test on WebKit with `--repeat-each=20`**

Run: `npx playwright test tests/form/submission.spec.js -g "loading state" --project=webkit --repeat-each=20 --workers=1`
Expected: 20 passed (20 total). All 20 iterations green confirms the structural fix works.

- [ ] **Step 4: Cross-engine sanity check**

Run: `npx playwright test tests/form/submission.spec.js -g "loading state" --project=chromium --project=firefox --repeat-each=10 --workers=1`
Expected: 20 passed (20 total) — 10 chromium + 10 firefox. Confirms no regression.

- [ ] **Step 5: Commit**

```bash
git add tests/form/submission.spec.js
git commit -m "test: Migrate loading-state test to deferred-promise route control"
```

---

### Task 3: Add Firefox tabindex instrumentation

**Files:**
- Modify: `tests/filter/accessibility.spec.js:44-49` (test "tabindex updates when filter changes")

- [ ] **Step 1: Replace the test body with an instrumented version**

Open `tests/filter/accessibility.spec.js`. Replace lines 44–49 (the existing test) with the instrumented version. The instrumented test runs the same assertions but captures per-button state at four checkpoints and attaches them to the trace:

```js
  test("tabindex updates when filter changes", async () => {
    // TEMPORARY INSTRUMENTATION — to be removed in a follow-up commit.
    // Captures per-button tabindex (attribute + IDL), aria-pressed, active
    // class, and document.activeElement at four checkpoints to diagnose
    // intermittent Firefox failure (received tabindex="0" instead of "-1").
    const captureState = (label) =>
      fp.page.evaluate((checkpoint) => {
        const buttons = Array.from(document.querySelectorAll(".filter-btn"));
        return {
          checkpoint,
          activeFilter: document.activeElement?.dataset?.filter ?? null,
          buttons: buttons.map((b) => ({
            filter: b.dataset.filter,
            attrTabindex: b.getAttribute("tabindex"),
            idlTabIndex: b.tabIndex,
            ariaPressed: b.getAttribute("aria-pressed"),
            isActiveClass: b.classList.contains("filter-btn--active"),
          })),
        };
      }, label);

    const cp1 = await captureState("after-goto");
    const cp2 = await captureState("before-click");
    await fp.clickFilter("backend");
    const cp3 = await captureState("after-clickfilter-resolved");

    // Capture the at-assertion state right before the failing assertion.
    const cp4 = await captureState("at-assertion");
    await test.info().attach("instrumentation-trace", {
      body: JSON.stringify({ cp1, cp2, cp3, cp4 }, null, 2),
      contentType: "application/json",
    });

    await fp.expectTabindex("all", -1);
    await fp.expectTabindex("backend", 0);
  });
```

- [ ] **Step 2: Lint and run once on Firefox to verify the instrumented test still works**

Run: `npm run lint:js`
Expected: no errors.

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --workers=1`
Expected: 1 passed (or fail with attached trace — both are acceptable; this run is just to verify the instrumentation code itself doesn't error).

- [ ] **Step 3: Commit**

```bash
git add tests/filter/accessibility.spec.js
git commit -m "test: Add Firefox tabindex flake instrumentation"
```

---

### Task 4: Reproduce + capture diagnosis

This task does not modify code. It runs the instrumented test repeatedly to capture failure traces, then assigns a diagnosis label that determines which Task 5 branch to take.

- [ ] **Step 1: Run instrumented test with `--repeat-each=50`**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --repeat-each=50 --workers=1`
Expected (one of):
- All 50 pass → flake did not reproduce locally; proceed to Step 2 (escalate).
- ≥1 fail → flake reproduced; proceed to Step 3 (read trace).

- [ ] **Step 2: Escalate to `--repeat-each=200` (only if Step 1 was all-green)**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --repeat-each=200 --workers=1`

If still all-green: the flake is CI-only. Pull recent failed CI runs from GitHub Actions:

```bash
gh run list --workflow=deploy.yml --limit=20 --json databaseId,conclusion,headBranch
gh run download <run-id-of-recent-failure>
npx playwright show-trace <downloaded-path>/test-results/*/trace.zip
```

The `instrumentation-trace` attachment in the trace contains the same `cp1..cp4` JSON. Proceed to Step 3 with whichever evidence source produced a failure.

- [ ] **Step 3: Read the failure trace and assign a diagnosis**

Run: `npx playwright show-trace test-results/*/trace.zip` (for the first failed run)

Open the `instrumentation-trace` attachment (Network/Attachments tab). Inspect the `cp1..cp4` JSON.

Apply this diagnostic table — find the **first** row that matches the trace, that is the diagnosis:

| Trace pattern | Diagnosis label |
|---|---|
| `cp1.buttons["all"].attrTabindex !== "0"` | **INIT_RACE** |
| `cp1` correct AND `cp2.buttons["all"].attrTabindex !== "0"` (something between goto and click clobbered it) | **STATE_LEAK** (rare; treat as INCONCLUSIVE for this PR — file separate BACKLOG) |
| `cp1`, `cp2` correct AND `cp3.buttons["all"].attrTabindex === "0"` AND `cp3.buttons["all"].isActiveClass === true` (click didn't run handler) | **CLICK_NOT_LANDED** |
| `cp3.buttons["all"].isActiveClass === false` AND `cp3.buttons["all"].attrTabindex === "0"` AND `cp3.buttons["all"].idlTabIndex === -1` (handler ran, IDL property correct, attribute lagged) | **REFLECTION_LAG** |
| Any pattern where attribute and IDL property disagree | **REFLECTION_LAG** |
| No clear pattern after reading 5+ failure traces | **INCONCLUSIVE** |

- [ ] **Step 4: Save diagnosis label for Task 5 routing**

Write the chosen label as a temporary note to yourself (do not commit). Pick the matching Task 5 sub-task:

| Diagnosis | Task |
|---|---|
| INIT_RACE | Task 5a |
| CLICK_NOT_LANDED | Task 5b |
| REFLECTION_LAG | Task 5c |
| INCONCLUSIVE | Task 5d |

This task has no commit — it is investigation only. The next commit comes from Task 5.

---

### Task 5a: Apply INIT_RACE fix (only if diagnosis = INIT_RACE)

**Files:**
- Modify: `tests/pages/FilterPage.js:47-51` (the `goto()` method)

- [ ] **Step 1: Replace `goto()` to wait for initial filter state**

In `tests/pages/FilterPage.js`, locate `goto()` (lines 47–51) and replace its body with:

```js
  async goto() {
    await this.page.goto("/");
    // Wait for JS to initialize (button labels with counts)
    await expect(this.filterButtons.first()).toContainText("(");
    // Wait for initial roving tabindex to be applied (Firefox INIT_RACE fix —
    // see docs/archive/plans/2026-04-28_test-stability-investigations.md
    // and BACKLOG.md "Test Stability Investigations" entry)
    await expect(this.button("all")).toHaveAttribute("tabindex", "0");
  }
```

- [ ] **Step 2: Verify the fix on Firefox**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --repeat-each=50 --workers=1`
Expected: 50 passed (50 total).

- [ ] **Step 3: Cross-engine sanity check**

Run: `npx playwright test tests/filter/ --project=chromium --project=webkit --workers=1`
Expected: all filter tests pass on both engines.

- [ ] **Step 4: Commit**

```bash
git add tests/pages/FilterPage.js
git commit -m "test: Fix Firefox tabindex flake via init-race goto guard"
```

Skip Task 5b, 5c, 5d. Proceed to Task 6.

---

### Task 5b: Apply CLICK_NOT_LANDED fix (only if diagnosis = CLICK_NOT_LANDED)

**Files:**
- Modify: `tests/pages/FilterPage.js:67-70` (the `clickFilter()` method)

- [ ] **Step 1: Replace `clickFilter()` to ensure button is actionable**

In `tests/pages/FilterPage.js`, locate `clickFilter()` (lines 67–70) and replace it with:

```js
  /** Click a filter button by category and wait for animation to finish */
  async clickFilter(category) {
    const btn = this.button(category);
    // Ensure button is in viewport and fully opaque before clicking
    // (Firefox CLICK_NOT_LANDED fix — see BACKLOG.md "Test Stability
    // Investigations" entry).
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toBeVisible();
    await btn.click();
    await waitForAnimationComplete(this.page);
  }
```

- [ ] **Step 2: Verify the fix on Firefox**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --repeat-each=50 --workers=1`
Expected: 50 passed (50 total).

- [ ] **Step 3: Cross-engine sanity check**

Run: `npx playwright test tests/filter/ --project=chromium --project=webkit --workers=1`
Expected: all filter tests pass on both engines.

- [ ] **Step 4: Commit**

```bash
git add tests/pages/FilterPage.js
git commit -m "test: Fix Firefox tabindex flake via clickFilter actionability guard"
```

Skip Task 5a, 5c, 5d. Proceed to Task 6.

---

### Task 5c: Apply REFLECTION_LAG fix (only if diagnosis = REFLECTION_LAG)

**Files:**
- Modify: `tests/pages/FilterPage.js:142-147` (the `expectTabindex()` method)

- [ ] **Step 1: Replace `expectTabindex()` to query IDL property instead of attribute**

In `tests/pages/FilterPage.js`, locate `expectTabindex()` (lines 142–147) and replace it with:

```js
  async expectTabindex(category, value) {
    // Query the IDL property `tabIndex` (always-current) rather than the
    // `tabindex` attribute (Firefox occasionally lags reflecting IDL writes).
    // Firefox REFLECTION_LAG fix — see BACKLOG.md "Test Stability
    // Investigations" entry.
    await expect
      .poll(
        () => this.button(category).evaluate((el) => el.tabIndex),
        { timeout: 5000 },
      )
      .toBe(value);
  }
```

- [ ] **Step 2: Verify the fix on Firefox**

Run: `npx playwright test tests/filter/accessibility.spec.js --project=firefox --repeat-each=50 --workers=1`
Expected: all tests in the file pass for 50 iterations. (Switching from attribute to IDL affects every `expectTabindex()` caller — must verify all callers still pass, not just the one being fixed.)

- [ ] **Step 3: Cross-engine sanity check**

Run: `npx playwright test tests/filter/ --project=chromium --project=webkit --workers=1`
Expected: all filter tests pass on both engines.

- [ ] **Step 4: Commit**

```bash
git add tests/pages/FilterPage.js
git commit -m "test: Fix Firefox tabindex flake via IDL-property assertion"
```

Skip Task 5a, 5b, 5d. Proceed to Task 6.

---

### Task 5d: Quarantine on Firefox (only if diagnosis = INCONCLUSIVE)

**Files:**
- Modify: `tests/filter/accessibility.spec.js:44` (the failing test signature)

- [ ] **Step 1: Replace the test body to add `test.fixme()`**

In `tests/filter/accessibility.spec.js`, replace the instrumented test (the version added in Task 3) with this quarantined version. Note: this REPLACES the instrumented body — instrumentation is removed in the same edit, so Task 6 is skipped on this branch:

```js
  test("tabindex updates when filter changes", async ({ browserName }) => {
    test.fixme(
      browserName === "firefox",
      "Firefox-only flake — root cause inconclusive after instrumentation. " +
      "See BACKLOG.md 'Test Stability Investigations' entry for findings and " +
      "reversal trigger.",
    );

    await fp.clickFilter("backend");

    await fp.expectTabindex("all", -1);
    await fp.expectTabindex("backend", 0);
  });
```

- [ ] **Step 2: Verify quarantine works on Firefox**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --workers=1`
Expected: 1 skipped (1 total). The `test.fixme()` marks it as expected-not-to-run; the run is reported as skipped, not failed.

- [ ] **Step 3: Verify other engines still run the test**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=chromium --project=webkit --workers=1`
Expected: 2 passed (2 total). Coverage preserved on Chromium and WebKit.

- [ ] **Step 4: Commit**

```bash
git add tests/filter/accessibility.spec.js
git commit -m "test: Quarantine Firefox tabindex flake with test.fixme"
```

Skip Task 5a, 5b, 5c, **and Task 6** (the quarantine commit also removed instrumentation). Proceed directly to Task 7.

---

### Task 6: Remove Firefox instrumentation (only if Task 5a, 5b, or 5c was taken)

**Files:**
- Modify: `tests/filter/accessibility.spec.js:44-49` (revert to original test body)

- [ ] **Step 1: Replace the instrumented test body with the clean version**

In `tests/filter/accessibility.spec.js`, replace the instrumented test (added in Task 3) with the clean post-fix version:

```js
  test("tabindex updates when filter changes", async () => {
    await fp.clickFilter("backend");

    await fp.expectTabindex("all", -1);
    await fp.expectTabindex("backend", 0);
  });
```

- [ ] **Step 2: Re-validate the fix without instrumentation**

Run: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --repeat-each=50 --workers=1`
Expected: 50 passed (50 total). Instrumentation itself can shift timing — re-validation confirms the fix holds without it.

- [ ] **Step 3: Commit**

```bash
git add tests/filter/accessibility.spec.js
git commit -m "test: Remove Firefox tabindex flake instrumentation"
```

- [ ] **Step 4: Optional history cleanup**

Tasks 3 and 6 cancel each other (add + remove instrumentation = empty diff vs. base). If the Firefox-fix commit is clean and reviewable, you may drop both via interactive rebase so only Tasks 5a/5b/5c land:

```bash
git rebase -i HEAD~5
```

Mark commits 3 and 6 as `drop`. Skip this step if you prefer the audit trail of instrumentation in git history.

---

### Task 7: Update BACKLOG entries

**Files:**
- Modify: `docs/planning/BACKLOG.md:854` (WebKit entry)
- Modify: `docs/planning/BACKLOG.md:865` (Firefox entry)

- [ ] **Step 1: Mark WebKit entry resolved**

In `docs/planning/BACKLOG.md`, locate line 854 (the WebKit submission flake entry) and replace it with:

```markdown
- [x] ~~Investigate pre-existing WebKit form submission flaky test~~ *(resolved 2026-04-28, replaced 500ms fixed-timeout route mock with deferred-promise pattern via new `mockFormspreeDeferred()` helper on FormPage POM — eliminates the click→assert race window structurally)*
```

- [ ] **Step 2: Update Firefox entry based on outcome**

In `docs/planning/BACKLOG.md`, locate line 865 (the Firefox tabindex flake entry).

**If Task 5a/5b/5c was taken (fix shipped):** Replace with:

```markdown
- [x] ~~Investigate pre-existing Firefox flaky test `tests/filter/accessibility.spec.js:44`~~ *(resolved 2026-04-28, root cause: <DIAGNOSIS_LABEL>; fix: <one-sentence summary of the fix from Task 5a/5b/5c>; closure pending 3 successive green Firefox CI runs after merge)*
```

Replace `<DIAGNOSIS_LABEL>` with `INIT_RACE`, `CLICK_NOT_LANDED`, or `REFLECTION_LAG`. Replace `<one-sentence summary>` with the actual fix description (e.g., "added init guard in `FilterPage.goto()`" / "added `scrollIntoViewIfNeeded()` to `clickFilter()`" / "switched `expectTabindex()` to poll IDL property").

**If Task 5d was taken (quarantine):** Replace with:

```markdown
- [ ] Investigate pre-existing Firefox flaky test `tests/filter/accessibility.spec.js:44` — *(quarantined 2026-04-28 with `test.fixme()` on Firefox-only after instrumentation was inconclusive)*. Findings:

```
<paste cp1..cp4 trace JSON from one representative failure here>
```

Hypotheses tested and eliminated: <list each row from the diagnostic table that did NOT match, e.g., "INIT_RACE: cp1 always showed correct initial state across 50+ runs">. Narrowed-down suspect: <e.g., "attribute reflection appears delayed by ~50–200ms in Firefox after IDL `tabIndex` mutation, but trigger condition could not be isolated">. Reproduction: `npx playwright test tests/filter/accessibility.spec.js -g "tabindex updates" --project=firefox --repeat-each=50 --workers=1` — observed failure rate <X>/<Y>. Reversal trigger: remove `test.fixme()` once a fix is shipped, OR after 6+ months without recurrence (re-run `--repeat-each=200` to verify before removal).
```

- [ ] **Step 3: Verify pre-commit BACKLOG path validator passes**

Run: `node scripts/validate-backlog-paths.js`
Expected: exits 0 with no output (or "BACKLOG Origin paths: OK" if Wednesday's success-output enhancement has landed). The validator only blocks `docs/planning/plans/` references, which the new entries do not contain.

- [ ] **Step 4: Commit**

```bash
git add docs/planning/BACKLOG.md
git commit -m "docs: Close test stability BACKLOG entries with findings"
```

---

### Task 8: Final cross-engine validation

This task is verification-only — no code changes, no commits.

- [ ] **Step 1: Run full filter + form suites across all engines**

Run: `npm test`
Expected: all tests pass (or `test.fixme` skipped count = 1 on Firefox if Task 5d was taken). No unexpected failures on any engine.

- [ ] **Step 2: Run full lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Sanity-check the branch state**

```bash
git log --oneline main..HEAD
git status --short
```
Expected: 4–6 commits on the branch (depending on which Task 5 path and whether Task 6 was rebased out), no uncommitted changes other than the auto-memory CLAUDE.md note from session start (if the user opted to leave it on this branch).

- [ ] **Step 4: Push and open PR**

```bash
git push -u origin test/stability-investigations
gh pr create --title "test: Stabilize Firefox tabindex + WebKit loading-state flakes" --body "$(cat <<'EOF'
## Summary
- WebKit loading-state flake: replaced fixed-timeout route mock with deferred-promise pattern via new `mockFormspreeDeferred()` FormPage helper (structural fix, eliminates click→assert race)
- Firefox tabindex flake: <one of: "diagnosed as <LABEL> and fixed via <one-sentence>" | "quarantined on Firefox-only via test.fixme() after inconclusive instrumentation; full findings in BACKLOG">
- BACKLOG entries updated with resolution status

## Test plan
- [ ] CI green on all three engines
- [ ] WebKit loading-state test verified locally with `--repeat-each=20`
- [ ] Firefox tabindex test verified locally with `--repeat-each=50` (or skipped on Firefox per quarantine)
- [ ] Cross-engine sanity: `npm test` all green

Spec: docs/archive/specs/2026-04-28_test-stability-investigations-design.md
Plan: docs/archive/plans/2026-04-28_test-stability-investigations.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Replace the angle-bracket placeholders in the PR body with the actual outcome before pushing.

---

## Self-review notes

- **Spec coverage:** Each phase in the spec maps to one or more tasks: Phase 2.1→Task 4 Step 1; 2.2→Task 3; 2.3→Task 4 Step 3 + Task 5a/b/c/d; 2.4→Task 6; 3.1→Task 1; 3.2→Task 2; 3.3→Task 2 Steps 3-4; 3.4→helper JSDoc in Task 1; Section 4 (quarantine)→Task 5d + Task 7; Section 5 (PR shape)→Task 8 Step 4; Section 6 (verification)→Task 2 Steps 3-4 + Task 5x Step 2-3 + Task 8.
- **Placeholder scan:** Task 7 Step 2 has angle-bracket `<DIAGNOSIS_LABEL>` and `<one-sentence summary>` placeholders. These are *intentional template fields* that the implementer fills in based on Task 4 outcome — the legal interpretation per the spec is unambiguous. Acceptable.
- **Type consistency:** `mockFormspreeDeferred()` in Task 1 returns `() => void`; Task 2 stores it as `releaseRoute` and calls it with `()`. Consistent. `expectTabindex()` signature unchanged in Task 5c (still `(category, value) => Promise<void>`). Consistent.
- **No redundant tasks:** Task 5d explicitly notes that it includes instrumentation removal (so Task 6 is skipped on the quarantine path), avoiding a redundant cleanup commit.
