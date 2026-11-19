# Day 09 — Database & Data Testing Practical Assessment

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Date:** 19 November 2026  
**Scope:** Five SQL-based verifications and three seeded data-integrity findings.

## Evidence boundaries
The assessment uses an **in-memory SQLite training database** with synthetic, intentionally imperfect data. Five application-style actions were **simulated using SQL**; no live UI or API was tested. SQL results are real outputs of the local SQLite run, but they do not establish application behavior.

## Files
- `seed.sql` — Create the sample database and deliberately flawed records.
- `verification-queries.sql` — Simulate five actions and verify their stored values.
- `integrity-checks.sql` — Check duplicates, orphans and missing fields.
- `action-verification-results.md` — Expected versus observed SQL results.
- `data-integrity-findings.md` — Three confirmed issues in the training dataset.
- `execution-results.json` — Machine-readable outputs captured during local execution.

## Reproduce
From this folder, using the SQLite CLI:

```bash
sqlite3 day09-assessment.db < seed.sql
sqlite3 -header -column day09-assessment.db < verification-queries.sql
sqlite3 -header -column day09-assessment.db < integrity-checks.sql
```

Rerun `seed.sql` to reset. **Use only a disposable training database.**

## Summary
- **5/5** simulated-action SQL verifications passed.
- **3/3** planted integrity issues detected.

## Remaining for complete application verification
Execute the same five actions through a real sample application's UI/API, capture request evidence, and verify its actual persisted records using SQL. No real application was supplied for this demonstration.
