# Day 09 — Intermediate: Data Integrity and SQL Verification

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 18 November 2026  
**Topic:** Database and Data Testing  
**Level:** Intermediate  
**Source:** Official Foundation Programme, Day 09 (page 14)  
**Previous notes:** [01 — Basic: Database and Data Testing](01-qa-basic.md)

> **Study notes, not execution evidence.** The tables, SQL and query outputs below are examples. I have not run them against an assessment database yet. I will record real test results and verified integrity findings separately during the Day 09 practical.

## 1. Intermediate learning objectives

The official Day 09 Intermediate syllabus covers:

1. **Data integrity:** duplicate records, orphan records, missing values and wrong defaults.
2. **Aggregations:** `COUNT`, `SUM` and `GROUP BY` to verify totals and reports.
3. **Test data management:** creating, resetting and protecting test data.
4. **Data edge cases:** deleted records, soft deletes and historical data.

**Main QA idea:** Checking the database is not only about finding a row. I need to verify that the stored values, relationships, counts, and behavior after changes match the requirements.

## 2. Example seeded data for the lesson

These are intentionally imperfect sample records used for explaining SQL checks.

### `customers`

| customer_id | name | email |
| ---: | --- | --- |
| 1 | Amina | amina@test.com |
| 2 | Rahim | rahim@test.com |
| 3 | Rafi | rahim@test.com |

### `orders`

| order_id | customer_id | amount | status |
| ---: | ---: | ---: | --- |
| 101 | 1 | 500 | paid |
| 102 | 2 | 300 | pending |
| 103 | 1 | 200 | pending |
| 104 | 99 | 150 | paid |
| 105 | 3 | 75 | NULL |

**Assumptions for these examples:** Customer emails must be unique; each order must reference an existing customer; order status is required. These are example business rules, not confirmed requirements of a real application.

**Note:** A properly enforced foreign-key constraint would normally prevent the orphan row (`order_id = 104`) from being inserted. A seeded training database may omit or disable that constraint so QA can investigate integrity issues.

## 3. Data integrity checks

### 3.1 Duplicate values

**Problem:** Two customers have the same email even though the application requires unique email addresses.

```sql
SELECT email, COUNT(*) AS duplicate_count
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

**Illustrative result:**

| email | duplicate_count |
| --- | ---: |
| rahim@test.com | 2 |

**Explanation:**
- `GROUP BY email` groups matching addresses.
- `COUNT(*)` counts the rows in each group.
- `HAVING COUNT(*) > 1` keeps only duplicate groups.

**QA impact:** Login, account recovery or notifications could behave incorrectly if uniqueness is required.

**Follow-up:** Check whether a `UNIQUE` constraint exists and whether the application prevents duplicate registration. Real products may intentionally allow shared emails; a bug exists only if this violates requirements.

### 3.2 Orphan records

**Problem:** An order references `customer_id = 99`, which does not exist in `customers`.

```sql
SELECT o.order_id, o.customer_id
FROM orders AS o
LEFT JOIN customers AS c
    ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
```

**Illustrative result:**

| order_id | customer_id |
| ---: | ---: |
| 104 | 99 |

**Explanation:** `LEFT JOIN` keeps every order, including those without a matching customer. The `WHERE` clause selects records where no customer was found.

**QA impact:** The order cannot be associated with a valid customer, potentially breaking reports, support or fulfillment.

### 3.3 Missing or empty required fields

**Problem:** An order has a missing status.

```sql
SELECT order_id, customer_id, status
FROM orders
WHERE status IS NULL
   OR TRIM(status) = '';
```

**Illustrative result:** `order_id = 105`.

- `IS NULL` detects missing/unknown SQL values.
- `TRIM(status) = ''` catches empty and whitespace-only text.
- Use `IS NULL`, **not** `= NULL`, when checking SQL NULL values.

**QA impact:** Missing required values can cause errors in order-processing logic and status dashboards.

### 3.4 Wrong default values

**Problem:** Suppose the requirement says newly created orders must start with status `pending`, but the system saves `paid` before payment.

A query can identify orders currently marked `paid`:

```sql
SELECT order_id, customer_id, status
FROM orders
WHERE status = 'paid';
```

**Important:** This query **does not prove a wrong default**. Some orders may have been paid legitimately. To confirm a defect, compare the new record immediately after creation, or check its status against a trusted event/audit history and the documented business rule.

**Additional checks:** Inspect the column's configured default, application creation path, timestamps and payment events as appropriate.

## 4. Aggregation functions: COUNT, SUM and GROUP BY

Aggregation helps QA verify totals displayed by dashboards, summaries or reports.

### 4.1 COUNT — Number of records

```sql
SELECT COUNT(*) AS total_orders
FROM orders;
```

**Illustrative result:** `5` orders.

`COUNT(*)` counts rows even when some of their columns contain NULL. `COUNT(status)` would count only rows where `status` is **not NULL**.

### 4.2 SUM — Add numeric values

```sql
SELECT SUM(amount) AS total_amount
FROM orders;
```

**Illustrative result:** `1225` = 500 + 300 + 200 + 150 + 75.

**QA use:** Compare amounts in a database with reported totals, after confirming which orders should be included.

### 4.3 GROUP BY — Summarize by status

```sql
SELECT status, COUNT(*) AS total_orders
FROM orders
GROUP BY status;
```

**Illustrative result:**

| status | total_orders |
| --- | ---: |
| paid | 2 |
| pending | 2 |
| NULL | 1 |

**This calculates the number of orders in each status group, not their monetary amount.**

To calculate the amount for each group:

```sql
SELECT status, SUM(amount) AS total_amount
FROM orders
GROUP BY status;
```

**Illustrative result:**

| status | total_amount |
| --- | ---: |
| paid | 650 |
| pending | 500 |
| NULL | 75 |

To calculate both:

```sql
SELECT
    status,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_amount
FROM orders
GROUP BY status;
```

**Illustrative result:**

| status | total_orders | total_amount |
| --- | ---: | ---: |
| paid | 2 | 650 |
| pending | 2 | 500 |
| NULL | 1 | 75 |

**Remember:**

- `COUNT(*)` = **How many rows?**
- `SUM(amount)` = **How much in total?**
- `GROUP BY status` = **Calculate separately for each status.**

**Note:** `SUM(amount)` ignores NULL amounts; it is not necessarily the same as a verified financial ledger balance. Include/exclude cancelled, refunded and other statuses based on business requirements.

### 4.4 WHERE vs HAVING

```sql
-- WHERE: filter individual rows before grouping.
SELECT status, COUNT(*) AS order_count
FROM orders
WHERE amount > 100
GROUP BY status;
```

```sql
-- HAVING: filter aggregate groups.
SELECT status, COUNT(*) AS order_count
FROM orders
GROUP BY status
HAVING COUNT(*) > 1;
```

| WHERE | HAVING |
| --- | --- |
| Filters individual rows | Filters grouped/aggregated results |
| Applied before aggregation | Applied after grouping |
| Example: `WHERE amount > 100` | Example: `HAVING COUNT(*) > 1` |

## 5. Test data management

**Why it matters:** Tests become unreliable if earlier runs leave duplicate records, changing IDs, statuses or other state that later tests depend on.

### 5.1 Create test data

```sql
INSERT INTO customers (customer_id, name, email)
VALUES (10, 'Test Customer', 'test10@example.com');
```

This is a **practice example** for a disposable test database, not a command to run in production.

### 5.2 Verify test data

```sql
SELECT customer_id, name, email
FROM customers
WHERE customer_id = 10;
```

Check the returned values against what was inserted.

### 5.3 Reset test data

If record 10 was created specifically for the test and has no dependent records:

```sql
DELETE FROM customers
WHERE customer_id = 10;
```

**Safety rules for QA:**

- Use a dedicated test database and synthetic data.
- Avoid deleting shared records or production data.
- Prefer a known fixture or reseeding process to keep tests repeatable.
- Run setup/cleanup in a controlled sequence.
- Never issue an unrestricted `DELETE` or `UPDATE` without understanding its impact.
- Where suitable, use transactions/rollback for isolation; transaction behavior is covered in the Advanced lesson.

## 6. Edge cases: deleted records, soft deletes and history

### 6.1 Hard delete

The row is physically removed:

```sql
DELETE FROM orders
WHERE order_id = 101;
```

Afterward, the same ID normally returns no row:

```sql
SELECT *
FROM orders
WHERE order_id = 101;
```

**QA check:** Confirm deletion is the required behavior and that dependent data is handled correctly. Do not execute on shared/production data.

### 6.2 Soft delete

The row stays in the database but is marked deleted, for example using a `deleted_at` column.

```sql
UPDATE orders
SET deleted_at = CURRENT_TIMESTAMP
WHERE order_id = 101;
```

For an application that uses that schema, active records may be queried as:

```sql
SELECT *
FROM orders
WHERE deleted_at IS NULL;
```

**Important:** These two queries assume an additional `deleted_at` column, which is **not present in the earlier sample `orders` table**. They are examples of a possible soft-delete design.

**QA checks:**
- Deleted records are hidden from normal user lists.
- Authorized administrative or historical views handle them according to requirements.
- A second deletion attempt behaves as specified.
- Related records remain consistent.

### 6.3 Historical data

Some systems must retain a past record even after a user profile or product changes.

**Example:** An order from last month should still show its historical purchase price even if the product's current price has increased.

**QA checks:**
- Historical snapshots remain accurate.
- Audit timestamps and actors are recorded when required.
- Changes do not rewrite finalized historical transactions unexpectedly.
- Sensitive historical data is accessible only to authorized roles.

## 7. Example QA checklist for Day 09

| Test scenario | SQL approach | Actual result |
| --- | --- | --- |
| Duplicate customer emails | `GROUP BY email HAVING COUNT(*) > 1` | Not executed |
| Orphan orders | `LEFT JOIN ... WHERE c.customer_id IS NULL` | Not executed |
| Missing statuses | `IS NULL OR TRIM(status) = ''` | Not executed |
| Order count by status | `COUNT(*) ... GROUP BY status` | Not executed |
| Total amount by status | `SUM(amount) ... GROUP BY status` | Not executed |
| Deleted vs active records | Check hard/soft deletion behavior | Not executed |

These queries demonstrate **how** to detect issues. The assignment requires finding **at least three actual issues in a seeded test database**, so the results above must not be reported as verified bugs yet.

## 8. My understanding and quick revision

1. **Data integrity:** Stored data must be correct, complete and consistent with rules.
2. **Duplicates:** Use `GROUP BY` and `HAVING COUNT(*) > 1` to investigate repeated values.
3. **Orphans:** Use `LEFT JOIN` to find child records without a matching parent.
4. **Missing data:** Use `IS NULL` and, for text, check blanks if required.
5. **Wrong defaults:** A suspicious current value is not proof; verify the requirement and creation history.
6. **Aggregations:** `COUNT(*)` counts rows and `SUM(amount)` adds amounts.
7. **Test data management:** Prepare and reset predictable synthetic records.
8. **Hard vs soft deletion:** Hard delete removes a row; soft delete marks it while retaining it.
9. **History:** Past records must remain correct according to retention and audit requirements.

## 9. Next step

Continue with **Day 09 Advanced**: transactions and rollback, data migration validation, and protecting/masking personal data in test environments.

Then complete the official practical: verify **five application actions** with SQL and discover **three real data integrity issues**, saving actual queries, results and findings in `day-09-data-testing`.
