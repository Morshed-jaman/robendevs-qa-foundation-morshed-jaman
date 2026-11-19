# Day 09 — SQL Verification Results

**Date:** 19 November 2026  
**Environment:** Local SQLite in-memory training database with synthetic seeded records.  
**Method:** SQL-simulated application actions; **no UI/API execution**.

| ID | Simulated action | Expected SQL state | Observed SQL state | Status |
|---|---|---|---|---|
| A01 | Register customer | Customer 10, Test User, test.user@test.example | Matches expected | PASS |
| A02 | Update profile | Customer 10 name = Test User Updated | Matches expected | PASS |
| A03 | Create order | Order 201, customer 10, amount 400, pending | Matches expected | PASS |
| A04 | Mark order paid | Order 201, status = paid | Matches expected | PASS |
| A05 | Soft-delete order | Order 201 has deleted_at; active count = 0 | deleted_at = 2026-11-19 12:00:00; active count = 0 | PASS |

**Local execution:** 5/5 expected-versus-actual SQL checks passed. The exact values are stored in `execution-results.json`.

**Limitation:** SQL changes simulate the application actions. Actual UI/API persistence has not been verified. These are not real application defect claims.

## Reproduction
Apply `seed.sql`, then `verification-queries.sql`; compare the SELECT results against this table.
