# Day 13 — Advanced: Failure and Recovery, Localisation, and AI/LLM Feature Testing

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Study date:** 28 November 2026  
**Level:** Advanced  
**Official source:** Day 13, page 17 (assignment on page 18; reading list on page 20)  
**Previous notes:** [01 — Basic](01-qa-basic.md) · [02 — Intermediate](02-qa-intermediate.md)

> **Learning notes, not executed assessment evidence.** Examples use a **hypothetical booking/CRM application**. No Day 13 test run, Jira defect or verified failure is claimed.

## Official Advanced syllabus

1. **Failure and recovery:** network loss mid-transaction, server errors and retry behaviour.
2. **Localisation:** languages, right-to-left text, date and number formats.
3. **AI and LLM features:** testing for wrong answers, unsafe output, prompt injection and inconsistent results.

At Advanced level the programme expects an intern to find non-obvious defects and reason about system behaviour under stress or failure (page 3). These topics build on Intermediate integrations and timeouts (section 3 of the Intermediate notes) and on the Day 3 time and user-behaviour edge cases.

---

## 1. Failure and recovery

### 1.1 Why failure testing matters

Happy-path tests assume the network and every server always work. Failure testing asks:

> When something breaks **in the middle** of an action, does the system end in a **correct, known state**, and can the user **safely continue**?

Properties to verify after any failure:

| Property | Meaning |
| --- | --- |
| No false success | The UI never shows "Confirmed" unless the server actually committed the operation. |
| No silent duplicate | A retry does not create a second booking, charge or email. |
| No silent loss | Data the server accepted is not lost. |
| Clear unknown state | If the outcome is unknown, the user is told and given a safe way to check. |
| Recoverable | After the failure clears, the system works normally without manual database fixes. |
| Traceable | Logs and a request/correlation ID let support follow what happened. |

### 1.2 Network loss mid-transaction

The **moment** the connection drops changes the risk:

| When the connection drops | What the server knows | What the user sees | Main risk |
| --- | --- | --- | --- |
| Before the request reaches the server | Nothing happened | Error or endless spinner | Low, if retrying is safe |
| **After the server commits, before the response arrives** | Booking created | Error or timeout | User retries → **duplicate**; or user believes it failed |
| Between steps of a multi-step flow (payment done, booking update pending) | Partial | Inconsistent | **Half-completed transaction** (paid, no booking) |

The second row is the **lost response** problem and the most dangerous one. It is why idempotency keys and status checks matter (see 1.4).

**Ways to simulate (approved test environments only):**
- Chrome DevTools → Network → **Offline** or a custom throttling profile.
- Playwright `context.setOffline(true)` and `page.route()` to abort or delay one request.
- Mobile: airplane mode, or switching Wi-Fi to mobile data mid-action.

Offline during confirmation (teaching example, hypothetical routes):

```ts
import { test, expect } from '@playwright/test';

test('confirm while offline shows a recoverable error', async ({ page, context }) => {
  await page.goto('/booking/checkout');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Confirm booking' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByText('Booking confirmed')).toHaveCount(0);
  await context.setOffline(false);
});
```

Lost response: the server processes the request, but the browser never receives the answer:

```ts
await page.route('**/api/bookings', async (route) => {
  await route.fetch();          // request reaches the server and is processed
  await route.abort('failed');  // browser receives a network error instead
});
```

| ID | Scenario | Expected (confirm against requirements) | Status |
| --- | --- | --- | --- |
| TC-FAIL-01 | Connection lost before the request reaches the server | Clear error, form data kept, safe retry | Not run |
| TC-FAIL-02 | Response lost after the server created the booking | Retry or refresh shows the **one** existing booking; no duplicate | Not run |
| TC-FAIL-03 | Network drops between payment and booking confirmation | Reconciliation completes or refunds per policy; no unresolved "paid, no booking" | Not run |
| TC-FAIL-04 | Tab refreshed or closed during confirmation | Reopening shows the true final state | Not run |

### 1.3 Server errors

| Status | Meaning | Retry? (typical) | QA checks |
| --- | --- | --- | --- |
| 400 / 422 | Invalid input | No, fix the input | Field-level message; form data preserved |
| 401 / 403 | Not logged in / not allowed | No (re-login for 401) | No data leaked; safe redirect |
| 409 | Conflict (version or state) | Not blindly | Clear message and a refresh option |
| 429 | Too many requests | Yes, after `Retry-After` | Client waits; no retry storm |
| 500 | Unexpected server error | Only if the operation is idempotent | Friendly message; **no stack trace, SQL or hostnames**; request ID logged |
| 502 / 503 / 504 | Bad gateway / unavailable / gateway timeout | Usually, with backoff | For **504 the outcome is unknown**: check state before resubmitting |

Checks for every error:
- The message is understandable and gives a next step.
- Internal details are not exposed in the UI or API body.
- User input is not wiped.
- Partial writes are rolled back (verify with SQL, Day 9).
- UI, API and database agree on the final state.

Mocking a server error with Playwright:

```ts
await page.route('**/api/bookings', (route) =>
  route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Service unavailable' }),
  }),
);
```

| ID | Scenario | Expected | Status |
| --- | --- | --- | --- |
| TC-FAIL-05 | 500 on Confirm | No false success; no stack trace; input kept; no half-written booking in DB | Not run |
| TC-FAIL-06 | 503, then service recovers | User can complete; no booking stuck in "pending" | Not run |

### 1.4 Retry behaviour

Key concepts:
- **Idempotent operation:** repeating it gives the same result. GET, PUT and DELETE are idempotent by HTTP definition; POST is not unless designed with an **idempotency key**.
- **Idempotency key:** a unique ID per business action sent with the request; the server returns the original result for repeats instead of creating a new record.
- **Exponential backoff with jitter:** wait about 1 s, 2 s, 4 s (plus a random amount) with a maximum number of attempts.
- **Retry storm:** many clients retrying at once overload a server that is trying to recover.
- **Circuit breaker:** stop calling a failing dependency for a period, fail fast, then test again.
- **Dead-letter queue:** where background jobs go after all retries fail, for review.

**Who retries?** Browser code, the API gateway, backend jobs and third-party webhook senders may all retry. Layers multiply: 3 frontend attempts × 3 backend attempts = **9 calls**.

| Question | How to check |
| --- | --- |
| How many attempts, with what delays? | Network tab timestamps, logs |
| Is there a maximum? | Keep the failure active and count requests |
| Does each retry reuse the same idempotency key? | Compare request headers |
| Is `Retry-After` respected on 429/503? | Mock a response with the header |
| What does the user see while retrying and after the last failure? | UI: progress, then a clear final message (no endless spinner) |
| Where does a failed background job go? | Admin panel, dead-letter queue, logs |
| Does a successful retry produce exactly one result? | API or database query |

Failing the first two calls, then letting the third through:

```ts
let calls = 0;
await page.route('**/api/availability', (route) => {
  calls += 1;
  return calls <= 2 ? route.fulfill({ status: 503 }) : route.continue();
});
// trigger the action, then assert only what the requirement defines:
expect(calls).toBe(3); // e.g. "retry twice, then succeed"
```

| ID | Scenario | Expected | Status |
| --- | --- | --- | --- |
| TC-FAIL-07 | POST retried after timeout | Same idempotency key; exactly one booking | Not run |
| TC-FAIL-08 | Maximum retries reached | Clear final failure message; no infinite loop or spinner | Not run |

### 1.5 Recovery checklist (after every failure test)

- [ ] Final state matches across UI, API and database.
- [ ] No orphan records (payment without booking, booking stuck in "processing").
- [ ] Notifications sent once, or as the policy defines.
- [ ] Audit log reflects what really happened.
- [ ] New operations work normally once the failure clears.
- [ ] The failure is traceable by request or correlation ID.

---

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, Day 13 Advanced, page 17.
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [MDN — Retry-After header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
- [Playwright — Network](https://playwright.dev/docs/network)
