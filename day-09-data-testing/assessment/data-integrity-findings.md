# Day 09 — Seeded Data Integrity Findings

These are **verified findings in a deliberately flawed synthetic SQLite dataset**, not bugs reported against a real application. Business rules below are exercise assumptions.

## D01 — Duplicate customer email
- **Assumed rule:** Email must be unique across customers.
- **Actual evidence:** `rahim@test.example` occurs twice (customer IDs 2 and 3).
- **SQL:** `SELECT email,COUNT(*) FROM customers GROUP BY email HAVING COUNT(*)>1;`
- **Risk:** Duplicate account identifiers may confuse lookups.
- **Suggested fix:** Confirm requirements, clean duplicates, then enforce uniqueness.

## D02 — Orphan order
- **Assumed rule:** Every order must reference an existing customer.
- **Actual evidence:** Order 104 references customer 99, which does not exist.
- **SQL:** `SELECT o.order_id,o.customer_id FROM orders o LEFT JOIN customers c ON c.customer_id=o.customer_id WHERE c.customer_id IS NULL;`
- **Risk:** Broken ownership and incomplete reports.
- **Suggested fix:** Enforce referential integrity and validate order creation.

## D03 — Missing required status
- **Assumed rule:** Every order must have a status.
- **Actual evidence:** Order 105 has `status=NULL`.
- **SQL:** `SELECT order_id,status FROM orders WHERE status IS NULL OR TRIM(status)='';`
- **Risk:** Order workflows and status reports may misbehave.
- **Suggested fix:** Validate status, use a required field constraint and permitted statuses.

**Result:** 3/3 intentionally seeded issues identified with executed SQLite queries. Proposed impacts and fixes were not separately tested.
