# Day 08 — Basic: Advanced API Testing Fundamentals

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Day:** 08  
**Level:** Basic  
**Date:** 17 November 2026  
**Source:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, page 13  
**Practice:** Postman Desktop, Swagger Petstore v2, Postman CLI

## 1. What I am focusing on

The official **Day 08 Basic** syllabus covers:

1. **Environments and variables:** Switching safely between development, staging and production.
2. **Assertions:** Writing Postman scripts to check status, response body and headers.
3. **Collection runs:** Running a complete collection and interpreting execution results.

I covered assertions, Postman Collection Runner and Newman during Day 07, so I am reviewing those briefly rather than recreating the same test collection. Today's new focus is environment management and building toward reusable, automated API tests.

## 2. Environments and variables

An **environment** is a set of configuration values for a target deployment. Common environments are:

| Environment | Purpose | Testing precautions |
| --- | --- | --- |
| Development | Developers verify changes during implementation | Data and endpoints may change frequently |
| Staging | QA validates release candidates before deployment | Prefer representative but non-sensitive test data |
| Production | Live system used by real customers | Avoid uncontrolled create, update and delete requests |

Instead of hardcoding each address, I can define a variable:

```http
GET {{baseUrl}}/pet/{{petId}}
```

Example of a **demo** Postman environment:

| Variable | Example value | Meaning |
| --- | --- | --- |
| `baseUrl` | `https://petstore.swagger.io/v2` | Target API base URL |
| `petId` | `202611160803` | Existing practice identifier (may no longer exist) |

With the right environment selected, Postman substitutes the variable values into the request. This reduces copying and editing requests when working across environments.

### Variable scopes I reviewed

- **Environment variable:** Configuration for the currently selected environment, such as `baseUrl`.
- **Collection variable:** Data shared by requests within a collection, such as a test record ID.
- **Global variable:** Broader workspace-level value; use sparingly to avoid unexpected collisions.
- **Local variable:** Temporary value within execution scope.
- **Iteration/data variable:** Value read from a CSV/JSON input row during a collection run.

**Safety:** Do not commit production tokens, real credentials, private cookies or sensitive environment exports. Prefer disposable records in a permitted test environment.

**Progress:** Studied the concept and variable syntax. An environment-switching practical run has **not been verified in the evidence provided so far**.

## 3. Assertions — brief revision from Day 07

Assertions compare the actual API response with an expected requirement. A passing HTTP status alone is not enough; I should also check the body and relevant headers.

```javascript
pm.test("Response status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is JSON", function () {
    pm.expect(pm.response.headers.get("Content-Type"))
        .to.include("application/json");
});

pm.test("Response body is an array", function () {
    pm.expect(pm.response.json()).to.be.an("array");
});
```

These are example checks to use on an endpoint expected to return HTTP 200 and a JSON array. Assertions must reflect the specific endpoint's contract; do not force failed tests to pass by weakening expectations.

**What I already practiced:** On Day 07, I wrote and executed status, JSON, value and authentication-related checks in a 25-request Swagger Petstore collection.

## 4. Collection runs — brief revision from Day 07

A **collection run** executes saved requests and their test scripts. It can be used to repeat a test suite and review its results.

During review, I should distinguish:

- **Requests:** The HTTP calls executed.
- **Iterations:** How many times the selected request or collection executes.
- **Assertions:** Individual checks inside the test scripts.
- **Failures:** Assertions whose expectations were not met.
- **Execution errors:** Problems such as invalid URLs or script/configuration errors that can prevent proper execution.

**Day 07 reference:** The previous Postman Collection Runner showed **25 requests, 52 assertions, 46 passed and 6 failed**. The later Newman workflow identified a separate **POS-15 missing-URL limitation**. These are historical Day 07 observations, not Day 08 execution results.

For dependent CRUD workflows, execution order matters: create the resource before retrieving/updating/deleting it. Report failures accurately instead of treating the total number of passing assertions as the number of successful requests.

## 5. How today's extra learning connects to Day 08 Basic

In addition to revising the three Basic topics, I moved ahead to **data-driven testing**, which the programme formally places under **Day 08 Intermediate**.

I created a parameterized pet-status request, prepared a CSV dataset, and learned to execute it through **Postman CLI** when Postman Desktop's Free-plan Runner blocked CSV uploads. This is recorded in the separate [`day-08-extra-learning.md`](./day-08-extra-learning.md), so the Basic curriculum stays clearly separated from Intermediate practice.

## 6. Basic learning checklist

- [x] Review development, staging and production environments and how variables work.
- [x] Review Postman assertion structure and execution-result interpretation from Day 07.
- [x] Review collection runs and request/iteration/assertion distinctions.
- [x] Understand why CLI execution can work when the Desktop Runner restricts data files.
- [ ] Configure and verify separate Postman environments against an actual test run.
- [ ] Record evidence of an environment switch and the resolved request URL.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, **Day 08, Basic**, page 13.
- [Postman Learning Center](https://learning.postman.com/)
- [Swagger Petstore demo API](https://petstore.swagger.io/)
