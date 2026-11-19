-- D01 Duplicate customer email
SELECT email, COUNT(*) AS duplicate_count FROM customers GROUP BY email HAVING COUNT(*) > 1;
-- D02 Orphan order
SELECT o.order_id,o.customer_id FROM orders o
LEFT JOIN customers c ON c.customer_id=o.customer_id
WHERE c.customer_id IS NULL;
-- D03 Missing or blank order status
SELECT order_id,status FROM orders WHERE status IS NULL OR TRIM(status)='';
