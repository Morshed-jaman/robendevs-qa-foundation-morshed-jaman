# Day 09 — Basic: Database and Data Testing

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Date:** 18 November 2026  
**Topic:** Database and Data Testing  
**Level:** Basic  
**Reference:** Official Foundation Programme, Day 09, page 14

## 1. Learning Objectives

The official Day 09 Basic syllabus covers:

1. **Database basics:** Tables, rows, columns, primary keys, and foreign keys.
2. **SQL for testers:** `SELECT`, `WHERE`, `ORDER BY`, and `JOIN`.
3. **Verifying actions:** Confirming that UI or API actions stored the expected data.

**My goal:** Learn how to validate database state rather than relying on a UI success message or an HTTP status code alone.

> **Evidence note:** All records and SQL outputs below are illustrative examples for study. They are not results of SQL queries executed against a real database. Actual execution results and findings belong in the Day 09 practical assessment.

## 2. What Is Database Testing?

Database testing means checking that an application's stored data matches its requirements: correct values, relationships, completeness, and expected changes after an action.

**Example:**

```text
Customer clicks "Place Order" in the UI
                  |
                  v
Backend/API processes the request
                  |
                  v
Database stores or updates the order
                  |
                  v
QA runs SQL to verify the stored record
```

Even if the application displays **"Order placed successfully"**, it is not proof that:

- The order was inserted into the database.
- It belongs to the correct customer.
- The amount and quantity are correct.
- The status is correct.
- No unintended duplicate order was created.

**QA principle:** Compare the **expected state** with the **actual database query result**.

## 3. Database Fundamentals

We will use two imaginary e-commerce tables.

### `customers`

| customer_id | name | email |
| ---: | --- | --- |
| 1 | Amina | amina@example.com |
| 2 | Rahim | rahim@example.com |

### `orders`

| order_id | customer_id | amount | status |
| ---: | ---: | ---: | --- |
| 101 | 1 | 500 | paid |
| 102 | 2 | 300 | pending |
| 103 | 1 | 200 | pending |

| Term | Meaning | Example |
| --- | --- | --- |
| **Database** | Organized collection of related data | Shop database |
| **Table** | Collection of related records | `customers` |
| **Row** | One record in a table | Amina's customer record |
| **Column** | One attribute of the records | `email` |
| **Primary key (PK)** | Uniquely identifies each row and cannot be NULL | `customers.customer_id` |
| **Foreign key (FK)** | References a key in another table | `orders.customer_id` |

### Primary key vs. foreign key

```text
customers.customer_id  <----  orders.customer_id
         PK                       FK
```

- `customers.customer_id` uniquely identifies a customer.
- `orders.customer_id` identifies which customer placed an order.
- For example, order **101** belongs to Amina (`customer_id = 1`).
- A correctly enforced foreign key prevents a reference to a non-existent customer.

## 4. SQL for QA Testers

SQL stands for **Structured Query Language**. Testers use it to inspect stored data and verify application behavior.

### 4.1 `SELECT` — Retrieve records

```sql
SELECT *
FROM customers;
```

- `SELECT` retrieves data.
- `*` selects all columns.
- `FROM` identifies the source table.

To retrieve specific columns:

```sql
SELECT name, email
FROM customers;
```

**Illustrative result:**

| name | email |
| --- | --- |
| Amina | amina@example.com |
| Rahim | rahim@example.com |

**QA use:** Confirm whether a registered customer exists in the database.

### 4.2 `WHERE` — Filter records

```sql
SELECT order_id, customer_id, amount, status
FROM orders
WHERE status = 'pending';
```

**Illustrative result:**

| order_id | customer_id | amount | status |
| ---: | ---: | ---: | --- |
| 102 | 2 | 300 | pending |
| 103 | 1 | 200 | pending |

**QA use:** Retrieve the exact record or set of records affected by an operation.

Another example:

```sql
SELECT *
FROM customers
WHERE email = 'amina@example.com';
```

### 4.3 `ORDER BY` — Sort records

```sql
SELECT order_id, amount
FROM orders
ORDER BY amount DESC;
```

**Illustrative result:**

| order_id | amount |
| ---: | ---: |
| 101 | 500 |
| 102 | 300 |
| 103 | 200 |

- `DESC`: descending order, highest to lowest here.
- `ASC`: ascending order.

**QA use:** Compare sorting in a dashboard or API against database output.

### 4.4 `JOIN` — Combine data from related tables

The order table has `customer_id`, while the customer's name is in `customers`. Use a join to get both:

```sql
SELECT
    c.name AS customer_name,
    o.order_id,
    o.amount,
    o.status
FROM orders AS o
INNER JOIN customers AS c
    ON o.customer_id = c.customer_id;
```

**Illustrative result:**

| customer_name | order_id | amount | status |
| --- | ---: | ---: | --- |
| Amina | 101 | 500 | paid |
| Rahim | 102 | 300 | pending |
| Amina | 103 | 200 | pending |

- `o` and `c` are short aliases for the tables.
- `ON` specifies the matching relationship.
- `INNER JOIN` returns only records with a matching row in both tables.

**QA use:** Verify that a stored order is linked to the correct customer.

## 5. Verify a UI/API Action Using SQL

Imagine this API request:

```http
POST /api/orders
Content-Type: application/json

{"customer_id":1,"amount":400}
```

Suppose the API responds with `order_id = 104`, and the business rule requires newly created orders to start as `pending`.

**Expected record:**

| order_id | customer_id | amount | status |
| ---: | ---: | ---: | --- |
| 104 | 1 | 400 | pending |

**SQL verification:**

```sql
SELECT order_id, customer_id, amount, status
FROM orders
WHERE order_id = 104;
```

I would verify the row exists **and** its customer ID, amount, and status match expectations. A returned row with incorrect data is not a PASS.

| Test record field | What to document |
| --- | --- |
| Action | UI operation or API request performed |
| Expected result | What the requirements say should be stored |
| SQL query | Exact verification statement |
| Actual result | Real returned rows |
| Status | PASS or FAIL after comparison |
| Evidence | Query result, screenshot, or exported result |

## 6. Planned Day 09 Practical Checks

The official assignment requires **five application actions** verified through SQL and at least **three data integrity findings** in a seeded database.

Possible actions for a sample application:

| # | Action | What to verify in the database |
| ---: | --- | --- |
| 1 | Register customer | Correct customer row and email |
| 2 | Update customer profile | Updated values for the intended customer |
| 3 | Create order | Correct customer, amount, and initial status |
| 4 | Change order status | Correct stored status |
| 5 | Cancel or delete order | Correct cancellation/deletion state according to requirements |

These are **planned examples** only; practical test execution has not yet been performed.

## 7. A Useful Distinction: Counting vs. Adding Totals

These aggregations belong to the **Intermediate** syllabus but clarify a question from today's study.

**Count the number of orders by status:**

```sql
SELECT status, COUNT(*) AS total_orders
FROM orders
GROUP BY status;
```

**Add the money amount by status:**

```sql
SELECT status, SUM(amount) AS total_amount
FROM orders
GROUP BY status;
```

**See both measures together:**

```sql
SELECT
    status,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_amount
FROM orders
GROUP BY status;
```

**Remember:** `COUNT(*)` counts rows; `SUM(amount)` adds the values in the amount column; `GROUP BY status` performs the calculation for each status group.

## 8. Quick Revision

1. **Row vs. column:** A row is one record; a column is one property.
2. **PK vs. FK:** A PK identifies a record; an FK connects related records.
3. **SELECT vs. WHERE:** `SELECT` chooses what data to retrieve; `WHERE` filters rows.
4. **ORDER BY:** Sorts query results.
5. **JOIN:** Combines related tables.
6. **QA verification:** A successful screen or API response is not enough; inspect the stored data.

## 9. Next Topics and Submission

**Intermediate:** Duplicates, orphan records, missing values, incorrect defaults, `COUNT`, `SUM`, `GROUP BY`, test data setup/reset, soft deletes, and historical data.

**Advanced:** Transactions, partial failures, schema migrations, privacy and data masking.

**Official Day 09 submission:** `day-09-data-testing` folder with SQL queries, execution results, and findings. The practical task requires verifying **five actions** and identifying **at least three integrity issues**.

**Current status:** Basic study notes completed. Actual database execution results and integrity findings remain to be completed.
