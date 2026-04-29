# Test Stability Investigations — Design Spec

**Date**: 2026-04-28
**Branch**: `test/stability-investigations`
**Status**: Design approved
**Source**: Monday slot of WEEKLY plan May 4–8, 2026 (5 SP timeboxed)

---

## Problem

Two Playwright flakes have been on the BACKLOG for ~2 weeks each. Both are pre-existing failures from before the recent test-stabilization work, both reproduce intermittently in CI, and both are difficult to reproduce locally.

| Flake | File | Engine | Failure mode | First noted |
|---|---|---|---|---|
| Tabindex update | `tests/filter/accessibility.spec.js:44` `"tabindex updates when filter changes"` | Firefox | After `clickFilter("backend")`, the `all` button still reports `tabindex="0"` instead of `"-1"` | 2026-04-16 |
| Loading state | `tests/form/submission.spec.js:36` `"shows loading state during submission"` | WebKit | `expect(submitText).toBeHidden()` times out on the submit button text | 2026-04-11 |

A non-trivial obstacle: the relevant code path for the Firefox flake (`updateTabindex()` in `js/main.js:391–395`) is **synchronous** — `btn.tabIndex = -1` reflects to the `tabindex` attribute synchronously per HTML spec. The current BACKLOG hypothesis ("update fires inside an animation step that Firefox may schedule differently") is likely a red herring; the real cause is something else.

The WEEKLY plan explicitly anticipates that one or both investigations may exceed budget: *"the goal is diagnosis with a fix proposal, not a guaranteed fix this week"* and *"if either test's root cause exceeds budget, document and defer the fix."* This spec defines what shipping in each outcome looks like.

---

## Scope

**In scope** — diagnose + fix what's clear:

- Investigate both flakes within the 5 SP day budget (Firefox 3 SP, WebKit 2 SP)
- Ship the WebKit fix in this PR if (and only if) the structural deferred-promise pattern works as expected — high confidence, low risk
- Ship a Firefox fix if root cause is confidently identified within the 3 SP investigation budget
- Otherwise, quarantine the Firefox test on Firefox-only via `test.fixme()` and update the BACKLOG entry with full findings

**Out of scope** (explicit anti-creep list):

- The Friday weekly challenge (replace `waitForScrollAnimations()` with deterministic polling) — separate spec, separate PR
- Tuesday's asset-checker polish work — different domain
- Any new flakes that surface during repeat-run investigation — file BACKLOG, do not chase here
- Proactive migration of other tests to `mockFormspreeDeferred()` — only the failing test adopts it
- Custom Playwright reporter or annotation infrastructure on top of `test.fixme()`
- Any modification to `js/main.js` — even if Firefox investigation suggests a JS-side workaround would help, product-code changes do not ship in a test-stability investigation PR. Suggestions go to BACKLOG as separate items.

---

## Investigation methodology — Firefox (3 SP)

### Phase 2.1 — Reproduce locally

```bash
npx playwright test tests/filter/accessibility.spec.js \
  -g "tabindex updates" \
  --project=firefox \
  --repeat-each=50 \
  --workers=1
```

Expected outcomes:
- Reproduces locally → proceed to Phase 2.2
- Green over 50 runs → escalate to `--repeat-each=200`
- Still green over 200 runs → flake is CI-only. Pull recent failed runs from GitHub Actions, inspect the saved trace.zip via `npx playwright show-trace test-results/<run>/trace.zip`. CI artifact mining replaces local repro for Phase 2.2.

### Phase 2.2 — Instrument with checkpoints

Add temporary `page.evaluate()` checkpoints inside the test that record per-button state at four points:

1. After `goto()` resolves
2. Immediately before the click is dispatched
3. Immediately after `clickFilter()` returns (after `waitForAnimationComplete`)
4. At the point the assertion would fire

For each checkpoint, capture:
- `tabindex` HTML attribute (`button.getAttribute("tabindex")`)
- `tabIndex` IDL property (`button.tabIndex`)
- Active class membership (`button.classList.contains("filter-btn--active")`)
- `aria-pressed` attribute
- `document.activeElement.dataset.filter` (which button has DOM focus)

Output goes to `console.log` and is attached to the trace via `test.info().attach()` so it survives CI artifact retention.

### Phase 2.3 — Diagnose from checkpoint output

| Checkpoint where wrong value first appears | Diagnosis | Fix shape |
|---|---|---|
| 1 (right after goto) | Init never set initial tabindex correctly | Add explicit init wait in `FilterPage.goto()` (e.g., `await expect(allButton).toHaveAttribute("tabindex", "0")`) |
| 2 (before click) | Prior test state leaked despite `beforeEach` | Investigate Playwright context reuse; likely test-config issue |
| 3 (after click resolves) | Click never fired or handler never ran | Improve `clickFilter()` actionability — wait for filter section opacity ≥ 0.99 before click, or scroll into view explicitly |
| 4 only (assertion timing) | Attribute reflection lagged — Firefox-specific | Switch test assertion from `toHaveAttribute("tabindex", "-1")` to `expect.poll(() => button.evaluate((el) => el.tabIndex)).toBe(-1)` (queries IDL property), or wrap in `waitForFunction` |
| Mismatch attribute vs. IDL property at any checkpoint | DOM API spec violation in Firefox | File upstream Firefox bug; quarantine locally |
| No clear pattern after 50 instrumented failures | Inconclusive | Quarantine path (Section 4) |

Each row maps to a different fix. We do not ship a fix until checkpoint output identifies one row.

### Phase 2.4 — Apply targeted fix and remove instrumentation

The fix commit ships the diagnosed change *with* instrumentation removed *and* a concise inline comment in the test linking to this spec doc. The fix must be re-validated with `--repeat-each=50 --project=firefox` after the instrumentation is removed (instrumentation itself can shift timing).

---

## WebKit fix — deferred-promise route control (2 SP)

### Phase 3.1 — Add reusable helper to `FormPage.js`

```js
// tests/pages/FormPage.js — new method
/**
 * Mock Formspree with a deferred response. Returns a release function that
 * resolves the response when the test calls it. Use to assert intermediate
 * states (e.g., loading state) without a fixed-timeout race.
 *
 * Always call the returned release function before assertions that wait on
 * the response, otherwise the test will hang until Playwright's per-test
 * timeout (default 30s) fires.
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

### Phase 3.2 — Migrate the failing test

Before:

```js
test("shows loading state during submission", async () => {
  await fp.page.route("**/formspree.io/f/*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await fp.fillAllFields();
  await fp.clickSubmit();
  await fp.expectLoadingState();
  await fp.expectSubmitDisabled();
  await fp.expectSuccess();
  await fp.expectSubmitEnabled();
});
```

After:

```js
test("shows loading state during submission", async () => {
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

### Phase 3.3 — Why this is "correct by construction"

The original test had a 500 ms response window during which the loading-state assertion had to land. If WebKit's click → assert overhead ate ≥500 ms, the response had already returned and the `finally` block had already restored the submit button text — assertion would fail.

The deferred-promise pattern *holds* the response indefinitely until the test explicitly releases it. There is no race window — the loading state is observable for as long as the test needs. This is a structural fix, not a timing band-aid; no statistical re-run is required to prove it.

### Phase 3.4 — Risks

If a test takes a code path that never calls `releaseRoute()`, the test hangs until Playwright's per-test timeout fires. The helper does not defend against this — discipline is in the test author. JSDoc documents the requirement (see Phase 3.1). Acceptable risk for a 1-test usage; revisit if the helper sees broader adoption.

---

## Firefox fallback — quarantine path (only if Phase 2.3 = inconclusive)

### Phase 4.1 — Quarantine

```js
// tests/filter/accessibility.spec.js:44
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

`test.fixme()` skips the test on the matched engine, marks it as expected-to-fail in reports. Other engines (Chromium, WebKit) still run the test — coverage is preserved on 2 of 3 engines.

### Phase 4.2 — Update BACKLOG entry

Replace the existing 1-line BACKLOG item (`docs/planning/BACKLOG.md:865`) with a richer entry that includes:

- All instrumentation traces collected (verbatim, in a fenced code block)
- Each hypothesis tested, and what evidence eliminated it
- The narrowed-down suspect, if any (e.g., "attribute reflection appears delayed by ~50–200 ms in Firefox after IDL `tabIndex` mutation, but only when X conditions are met — could not isolate trigger")
- Reproduction recipe (exact CLI invocation, observed failure rate)
- Reversal trigger: "remove `test.fixme()` once a fix is shipped"

### Phase 4.3 — Reversal contract

The `test.fixme()` annotation is debt, not a permanent solution. The BACKLOG entry stays in the open backlog (not archived) until either:

- A fix is shipped and the annotation is removed, OR
- 6+ months pass without recurrence (Firefox version may have fixed the underlying issue), at which point the `fixme` is removed and `--repeat-each=200` re-runs to verify

The annotation comment must include a pointer to the spec doc + BACKLOG so reviewers and future-self can find context immediately.

---

## PR shape & sequencing

### Single PR

Both flakes ship in one PR on branch `test/stability-investigations`. Rationale:

- 5 SP fits in one Monday session per WEEKLY plan
- Independent test files (`tests/filter/accessibility.spec.js`, `tests/form/submission.spec.js`) and one shared POM (`tests/pages/FormPage.js`) — no merge-conflict risk
- Splitting would double review overhead with no separation-of-concerns benefit
- "Test stability investigations" is more coherent as one PR

### Commit sequencing

Each commit is independently reviewable:

1. `test: Add mockFormspreeDeferred helper to FormPage POM` — helper-only, no test changes
2. `test: Migrate loading-state test to deferred-promise route control` — uses helper, fixes WebKit flake
3. `test: Add Firefox tabindex flake instrumentation` — adds checkpoints (temporary)
4. `test: <one of>` — depending on Phase 2.3 outcome:
   - `test: Fix Firefox tabindex flake via <root-cause-specific fix>` (fix path), OR
   - `test: Quarantine Firefox tabindex flake with test.fixme` (deferral path)
5. `test: Remove Firefox tabindex flake instrumentation`

If the deferral path is taken, commits 3 and 5 cancel each other (add + remove instrumentation = empty diff) and may be dropped via interactive rebase so only commit 4 lands. The instrumentation evidence lives in the spec doc and BACKLOG, not in git history.

### Outcome matrix

| Firefox investigation outcome | What ships |
|---|---|
| Root cause identified, fix works | WebKit fix + Firefox fix + BACKLOG: both items closed |
| Root cause identified, fix is too risky | WebKit fix + `test.fixme()` + BACKLOG: WebKit closed, Firefox updated with proposed fix |
| Inconclusive after full budget | WebKit fix + `test.fixme()` + BACKLOG: WebKit closed, Firefox updated with findings |

In all three outcomes, the WebKit fix ships. That is the contract.

---

## Verification / done definition

### WebKit fix

- Local: `npx playwright test tests/form/submission.spec.js -g "loading state" --project=webkit --repeat-each=20 --workers=1` — all 20 pass
- Cross-engine sanity: `--repeat-each=10` on chromium and firefox — confirms no regression
- CI: PR's CI run is green on all three engines
- Structural confirmation: code review comparison of the test before/after shows no fixed-timeout race remains

### Firefox investigation

- **Fix-shipped path:** `--project=firefox --repeat-each=50` is green locally, AND the next 3 successive CI runs after merge are green on Firefox for that test specifically. (BACKLOG entry stays open until 3-CI-run criterion is met; closed only when criterion is satisfied.)
- **Quarantine path:** `--project=firefox` skips the test as expected (`test.fixme` exit code is non-failure); `--project=chromium` and `--project=webkit` both still run and pass it; BACKLOG entry updated per Phase 4.2.

### Documentation deliverables

- This spec doc archived to `docs/archive/plans/` after PR merges (per CLAUDE.md task completion workflow)
- BACKLOG.md entries for both items updated (closed or expanded with findings)
- ROADMAP.md unchanged (this work is "Quality & Hardening" maintenance, not a new phase)

---

## Open questions

None at design time. All design choices were resolved during brainstorming Q1–Q4 (deliverable shape, investigation methodology, WebKit fix shape, Firefox deferral mechanism).

---

## References

- BACKLOG entries: `docs/planning/BACKLOG.md:854` (WebKit), `docs/planning/BACKLOG.md:865` (Firefox)
- WEEKLY plan: `docs/planning/WEEKLY.md` Monday section
- Prior Firefox stabilization (Apr 10): commit `41bdb34`, related to rapid-clicks pattern (different test, different shape)
- Prior WebKit timing precedent: none — this is the first WebKit-specific flake fix in the test suite
- Animation-polling pattern reference: `tests/utils/timing.js` `waitForAnimationComplete()`
