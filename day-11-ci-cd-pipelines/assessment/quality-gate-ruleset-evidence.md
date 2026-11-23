# Day 11 — GitHub CI Quality Gate: Ruleset Evidence

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Recorded:** 23 November 2026  
**Purpose:** Save a factual record of the GitHub branch ruleset and its practical verification before disabling or deleting the ruleset.

## 1. Ruleset snapshot (verified on GitHub)

| Property | Value |
| --- | --- |
| Ruleset name | `Day 11 - CI Quality Gate` |
| Ruleset ID | `27886061` |
| Scope | Repository branch ruleset |
| Target | Default branch (`main`) |
| Enforcement at capture | Active |
| Pull request required | Yes |
| Required approvals | 0 |
| Require status checks | Yes |
| Require branches up to date | Yes |
| Required check 1 | `Playwright - Chromium` (GitHub Actions) |
| Required check 2 | `Newman - API smoke` (GitHub Actions) |
| Restrict deletions | Yes |
| Block force pushes (non-fast-forward updates) | Yes |
| Allowed merge methods | Merge, squash, rebase |
| Bypass actors | None configured |

[Original ruleset](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/rules/27886061) — **this link may stop working after the rule is deleted; the table above is the retained snapshot.**

## 2. What was practiced and observed

1. Created feature branch `practice/day11-quality-gate` and opened [Pull Request #1](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/pull/1) targeting `main`.
2. The two required checks, `Playwright - Chromium` and `Newman - API smoke`, **both passed**, and GitHub enabled the merge button.
3. Intentionally changed the expected title in the first Playwright TodoMVC test from `Learn Playwright` to `Wrong Task Name`.
4. GitHub Actions ran again: **Playwright failed; Newman passed**. GitHub disabled the Merge pull request button because a required check failed.
5. Restored the original `Learn Playwright` assertion and pushed the correction.
6. GitHub confirms Pull Request #1 was **merged**. The version of `tests/todo.spec.js` on `main` contains the original assertion.

The deliberately failing assertion was a **quality-gate experiment**, not an actual defect found in the demo application.

## 3. Learning outcomes

- GitHub Actions executes existing Playwright browser and Newman API tests on repository events.
- Branch protection rules can make passing checks mandatory before merging to `main`.
- A failed required job can block the merge even when another job succeeds.
- Repairing the test and pushing a new commit allows CI to recheck the change.
- Reports and workflow run histories provide evidence of automated testing.

## 4. Evidence links

- [Pull Request #1 — passing, failing, restored test history](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/pull/1)
- [Day 11 GitHub Actions workflow](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/blob/main/.github/workflows/day11-qa-ci.yml)
- [Verified successful push run 45141874922](https://github.com/Morshed-jaman/robendevs-qa-foundation-morshed-jaman/actions/runs/45141874922)

**Scope:** GitHub Actions CI and GitHub branch-protection practice only. No Bitbucket Pipeline, production deployment, or complete official Bitbucket-specific assessment is claimed.
