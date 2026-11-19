# Day 09 — Advanced: Transactions, Migrations and Data Privacy

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 19 November 2026  
**Topic:** Database and Data Testing  
**Level:** Advanced  
**Reference:** Official Foundation Programme, Day 09, page 14  
**Previous lessons:** `01-qa-basic.md` and `02-qa-intermediate.md`

> **Evidence note:** This file contains learning notes, hypothetical test cases, and illustrative SQL. No examples below are claims of real test execution or verified defects. Run write operations only in a disposable test database. SQL behavior and syntax can differ by database engine.

## 1. Learning objectives

The official Day 09 Advanced syllabus covers three areas:

1. **Transactions:** What should happen when an action fails halfway?
2. **Data migrations:** Testing that existing data survives a schema change.
3. **Data privacy:** Masking personal data and checking access in test environments.

The main QA goal is to verify that data remains **correct, consistent, recoverable, and appropriately protected**, even when something goes wrong.

---

## 2. Transactions and partial failures

### 2.1 What is a transaction?

A transaction groups one or more operations into a logical unit. When the application needs an all-or-nothing result, either all required changes should be committed or the operation should be rolled back.

**Example: Transfer 500 from Account A to Account B**

| Account | Before transfer | After a successful transfer |
| --- | ---: | ---: |
| Account A | 2000 | 1500 |
| Account B | 1000 | 1500 |
| **Total** | **3000** | **3000** |

If money is deducted from A but not credited to B, the system has entered an inconsistent state.

**Illustrative SQL:**

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE account_id = 1;

UPDATE accounts
SET balance = balance + 500
WHERE account_id = 2;

COMMIT;
```

In a real application, the transaction should commit **only after** checking the required preconditions and results of both updates. If either required update fails, the application should issue `ROLLBACK` instead. A successful SQL command by itself may not guarantee that exactly one intended row was updated.

**Illustrative rollback:**

```sql
BEGIN;

-- Example update in an isolated test database
UPDATE accounts
SET balance = balance - 500
WHERE account_id = 1;

-- Simulate a failure or intentionally cancel this test
ROLLBACK;
```

### 2.2 ACID properties in testing

| Property | Meaning | QA question |
| --- | --- | --- |
| **Atomicity** | All required operations happen or none are committed | Was a partial transfer left behind? |
| **Consistency** | Constraints and business invariants remain valid | Did the combined balance change unexpectedly? |
| **Isolation** | Concurrent transactions behave according to the required isolation level | Could two requests overspend the same balance? |
| **Durability** | Once committed, the data survives a failure | Is a confirmed payment still recorded after restart? |

### 2.3 How QA verifies a partial failure

Imagine an order workflow that creates an order and reduces product stock.

**Expected success:** Order is created, stock decreases by the ordered quantity, and an appropriate confirmation is returned.

**Expected failure (if atomicity is required):** An order creation or stock update failure must leave neither a finalized new order nor an unintended stock decrease.

**Example verification queries:**

```sql
-- Check whether an order remains after a failed operation.
SELECT order_id, customer_id, status
FROM orders
WHERE order_id = 104;

-- Check stock before and after the failure.
SELECT product_id, stock_quantity
FROM products
WHERE product_id = 10;
```

**QA test ideas:**

- Simulate failure after the first database change but before completion.
- Verify all-or-nothing behavior when it is a business requirement.
- Attempt the operation with invalid or insufficient stock data.
- Confirm error responses do not hide incomplete stored changes.
- Check that retries do not create duplicate orders.

> For workflows spanning different services or external payment systems, a single database rollback may not be sufficient. The expected compensating behavior must come from the system requirements.

---

## 3. Data migration testing

### 3.1 What is a migration?

A data or schema migration changes the structure or location of stored information. It may add a column, change a data type, rename a field, introduce a new table, or transfer existing records.

**Example:** The `customers` table gains a `phone` column. Existing customer records must still be present, with their previous IDs, names, and emails intact.

**Illustrative change:**

```sql
-- Syntax shown for common relational databases;
-- check the database engine before executing.
ALTER TABLE customers
ADD COLUMN phone VARCHAR(20);
```

### 3.2 What could go wrong?

- Rows disappear during migration.
- Values become `NULL` or are truncated unexpectedly.
- Types change incorrectly (e.g., decimal amounts lose precision).
- Primary or foreign-key relationships break.
- Duplicate records are introduced.
- Application queries no longer match the new schema.
- Rollback or recovery does not work if deployment fails.

### 3.3 QA before-and-after checks

| Check | Before migration | After migration |
| --- | --- | --- |
| Row count | Record count | Same count unless specified otherwise |
| Primary keys | List of IDs | All expected IDs preserved |
| Required fields | Null/blank counts | No new invalid values |
| Relationships | Orphan count | No unexpected orphan records |
| Business totals | Sum of amounts | Expected totals remain correct |
| Application actions | Critical workflow behavior | Critical workflows still work |

**Example verification queries:**

```sql
-- Compare this result before and after migration.
SELECT COUNT(*) AS customer_count
FROM customers;

-- Detect duplicated customer IDs if the schema allows it.
SELECT customer_id, COUNT(*) AS occurrences
FROM customers
GROUP BY customer_id
HAVING COUNT(*) > 1;

-- Check missing required fields.
SELECT COUNT(*) AS missing_emails
FROM customers
WHERE email IS NULL OR TRIM(email) = '';

-- Check order totals before and after migration.
SELECT COUNT(*) AS order_count, SUM(amount) AS amount_total
FROM orders;
```

Comparing counts and sums provides useful signals, but **does not prove that every value is unchanged**. Where appropriate, compare stable record IDs, field values, checksums, and relationships using trusted snapshots or exports.

### 3.4 Migration test sequence

1. Take an approved, protected test backup or baseline snapshot.
2. Record baseline counts, key values, constraints and business totals.
3. Run the migration in a test or staging environment.
4. Repeat the verification SQL and compare actual versus expected results.
5. Re-test critical UI/API operations that depend on changed tables.
6. Test the approved recovery procedure if the migration fails.

**Example finding (hypothetical):** Before migration: 100 customers. After migration: 98 customers. If no records should be removed, investigate two missing rows and save IDs, query output, and migration logs. This is not a verified issue in the current assessment.

---

## 4. Data privacy and masking in test environments

### 4.1 Why QA needs to check privacy

Testing databases can contain names, emails, phone numbers, addresses and other personal information. A development or staging environment may have more users and less stringent access than production, so real personal data must not be copied into it casually.

**Preferred practice:** Use fabricated, synthetic records (e.g., `amina@example.com`) for ordinary testing. If a real-data-based dataset is strictly necessary, follow the organization's approved de-identification and access-control processes.

### 4.2 Masking versus access controls

| Approach | Purpose | Example |
| --- | --- | --- |
| Synthetic data | Avoid importing real personal data | `tester01@example.com` |
| Masking | Obscure sensitive fields | `am***@example.com` in UI |
| Pseudonymization | Replace identifiers with controlled substitutes | Customer ID maps to test ID |
| Least-privilege access | Limit who may read records | Read-only QA role |
| Audit logs | Trace access where required | Who viewed or exported data |

Masking a display is **not** equivalent to securing the underlying database. Test data protection needs both suitable data and correct permissions.

### 4.3 Illustrative SQL to display a masked email

```sql
-- A display-only example. This does not change the stored value.
SELECT customer_id,
       '***@' || SUBSTR(email, INSTR(email, '@') + 1) AS masked_email
FROM customers;
```

The example uses SQLite-style `||`, `SUBSTR` and `INSTR` expressions and assumes non-NULL valid email strings. Other database engines may use different functions. It is not a replacement for approved masking rules.

**Example output:**

| customer_id | masked_email |
| ---: | --- |
| 1 | `***@example.com` |
| 2 | `***@example.com` |

### 4.4 Privacy-focused QA test ideas

- Verify that a user without permission cannot read other users' private records.
- Check that non-admin pages and API responses do not expose full personal fields unnecessarily.
- Confirm that test environments use synthetic or approved appropriately de-identified data.
- Verify that logs, screenshots, exported reports, and error messages do not leak personal data.
- Confirm roles receive only the access needed for their testing tasks.
- Check that database backups and exports follow retention and access rules.

**Example test case:**

| Field | Value |
| --- | --- |
| Test case ID | DB-PRIV-01 |
| Scenario | Unauthorized user requests another customer's private profile |
| Precondition | Two separate test users with known access permissions |
| Action | User A attempts to read User B's private data |
| Expected | Access denied and User B's private fields are not exposed |
| Evidence | Response code/body, permitted logs, and relevant query results |
| Execution status | Not executed — proposed exercise |

---

## 5. Revision: connecting Advanced topics to QA

| Advanced topic | Common failure | What QA verifies |
| --- | --- | --- |
| Transaction | Only half an operation completed | Rollback and correct final state |
| Migration | Existing data lost or changed | Baselines compared with migrated data |
| Privacy | Sensitive information revealed | Masking, permissions and safe data use |

### Self-check questions

1. Why should a transfer fail as a single unit instead of saving only the first update?
2. What does `ROLLBACK` do?
3. How is a transaction different from a migration?
4. Why is comparing row counts alone not enough after migration?
5. Why should a QA environment prefer synthetic records?
6. Can UI masking alone protect a database from unauthorized access?

**Short answers:**

1. To avoid inconsistent balances; 2. Undoes uncommitted changes in the transaction; 3. A transaction groups operations while a migration changes schema/data organization; 4. Equal counts may hide altered values; 5. To reduce personal-data exposure; 6. No, underlying permissions and controls are also required.

## 6. Official Day 09 practical and submission (not completed here)

The official practical requires:

- Verify **five application actions** with SQL queries checking what was stored.
- Find at least **three actual data integrity issues** in a seeded test database.
- Submit the `day-09-data-testing` folder containing **queries, results and findings**.

Suggested evidence structure:

```text
day-09-data-testing/
├── 01-qa-basic.md
├── 02-qa-intermediate.md
├── 03-qa-advanced.md
└── assessment/
    ├── verification-queries.sql
    ├── action-verification-results.md
    └── data-integrity-findings.md
```

The `assessment/` files are a proposed organization, not a claim that they already exist.

**Current status:** Advanced study material prepared. No practical SQL execution, migration, transaction, or privacy-test result is claimed.
