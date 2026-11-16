# Day 7 — Basic: API Testing Fundamentals

**Programme:** RoBenDevs QA Engineer Internship — 14-Day Foundation Programme  
**Topic:** API Testing Fundamentals  
**Level:** Basic  
**Source:** Foundation Programme, Day 7, page 12  
**Date:** 16 November 2026

## 1. What I Am Learning Today

Day 7 introduces how to test an application's API directly rather than only through its user interface. I will focus on the five **Basic** topics stated in the foundation programme:

1. REST APIs: resources, endpoints, methods and status codes
2. JSON: request and response bodies
3. Reading API documentation: parameters, headers and examples
4. Postman basics: sending requests and saving them in collections
5. cURL: running requests from the terminal and copying requests from DevTools

I will keep actual execution results separate from examples so I can clearly tell what I have tested.

## 2. REST APIs: Resources and Endpoints

An **API** (Application Programming Interface) defines how one application component can request data or operations from another.

A **resource** is the item being worked with (for example, an employee, user or post). An **endpoint** is a specific URL/path that exposes an operation for a resource.

**Example from my Day 6 OrangeHRM investigation**

- Application: OrangeHRM public demo
- Resource: employees
- Endpoint: `/web/index.php/api/v2/pim/employees`
- Observed request type: `GET`
- Observed successful response: `200 OK` with JSON employee information

### Common HTTP Methods

| Method | Common use | Example |
| --- | --- | --- |
| `GET` | Read data | Retrieve an employee or a post |
| `POST` | Submit/create data | Create a new post |
| `PUT` | Replace a resource | Replace the stored content of a post |
| `PATCH` | Partially modify a resource | Change only the title |
| `DELETE` | Remove a resource | Delete a post |

These are REST conventions. Exact capabilities and expected statuses depend on each API's documentation.

### Common HTTP Status Codes

| Code | Meaning | QA observation |
| --- | --- | --- |
| `200 OK` | Request succeeded | Check the returned data, not just the code |
| `201 Created` | New resource created | Verify creation and identifiers |
| `204 No Content` | Success with no response body | Do not expect JSON content |
| `301/302` | Redirect | Inspect the `Location` header |
| `400 Bad Request` | Invalid request | Check error body and validation rules |
| `401 Unauthorized` | Missing or invalid authentication | Verify protected data is not exposed |
| `403 Forbidden` | Access denied | Distinguish authenticated but unauthorized access |
| `404 Not Found` | Resource/route unavailable | Confirm requested ID/path |
| `500 Internal Server Error` | Server-side failure | Record request and safe error details |

**Lesson carried over from Day 6:** A `200` response alone is not proof that the UI or response body is correct. A `302` redirect is not necessarily a bug.

## 3. JSON: Request and Response Bodies

JSON (JavaScript Object Notation) is a common format for exchanging structured data between a client and an API.

Illustrative employee response:

```json
{
  "data": [
    {
      "firstName": "Joy",
      "lastName": "Smith",
      "employeeId": "0364"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

JSON terms:

- **Object:** Key-value pairs in `{}`
- **Array:** Ordered values in `[]`
- **String:** Text in double quotes
- **Number:** Numeric value without quotes
- **Boolean:** `true` or `false`
- **null:** No defined value

QA checks include whether fields are present, correct types are returned, values are valid, and response totals match the data.

**Request body vs. response body:** A request body contains data sent to a server, often for POST/PUT/PATCH. A response body contains data returned by the server. GET requests commonly carry input in the URL path or query parameters rather than a JSON body.

## 4. Reading API Documentation

Before designing tests, I should look for:

| Documentation field | Question I should ask |
| --- | --- |
| Base URL and endpoint | Where do I send the request? |
| HTTP method | Is it GET, POST, PUT, PATCH or DELETE? |
| Path parameters | Does the resource ID belong in the path? |
| Query parameters | Can I filter, paginate or sort the results? |
| Required headers | Is `Accept`, `Content-Type` or authorization required? |
| Authentication | Does the endpoint require a bearer token, API key or session? |
| Body schema | Which fields and data types are permitted? |
| Success/error examples | What response fields and statuses should I expect? |

**Example:**

```text
GET https://jsonplaceholder.typicode.com/users/1
Accept: application/json
```

Here, `1` is the user ID in the URL path. The example API is for practice.

## 5. Postman Basics

Postman provides a graphical interface for sending HTTP requests and viewing their responses.

### First practice request (planned in Postman; not yet executed in the screenshots)

1. Open Postman.
2. Create an HTTP request.
3. Select `GET`.
4. Enter `https://jsonplaceholder.typicode.com/users/1`.
5. Choose **Send**.
6. Inspect status, headers and response JSON.
7. Save the request into the collection `RoBenDevs - Day 07 API Testing`.

**To record after actual execution:** endpoint, method, expected outcome, actual status, key response fields, pass/fail, and a sanitized screenshot.

### Collection Organization for the Day 7 Assignment

Suggested subfolders in the Postman collection:

- `01-Positive`
- `02-Negative`
- `03-Authentication`

These are **planned collection groups**, not a claim that the 25 Postman requests are already complete.

## 6. cURL Fundamentals

**cURL** sends HTTP requests from the terminal. In Windows PowerShell 5.1, `curl` can be an alias for `Invoke-WebRequest`. I used **`curl.exe`** to execute the actual cURL program.

```powershell
curl.exe -i "https://jsonplaceholder.typicode.com/users/1"
```

- `curl.exe`: Calls the Windows cURL executable
- `-i`: Prints response headers as well as the body
- URL: The target API endpoint

### How I can get a cURL command from DevTools

1. Open DevTools → Network.
2. Trigger the relevant API request in the application.
3. Right-click the request → Copy → **Copy as cURL**.
4. Inspect the command and remove **cookies, tokens, passwords and other secrets** before sharing.
5. Adapt Bash formatting to PowerShell if needed.

### cURL Execution Evidence Already Observed (16 November 2026)

These results were shown in screenshots of my Windows PowerShell terminal. They count as **three cURL executions**, not as Postman requests.

| ID | Request | Observed result |
| --- | --- | --- |
| `CURL-01` | `GET https://jsonplaceholder.typicode.com/users/1` | `200 OK`, JSON object |
| `CURL-02` | `GET https://jsonplaceholder.typicode.com/posts/1` | `200 OK`, JSON object |
| `CURL-03` | `GET https://jsonplaceholder.typicode.com/posts/1/comments` | `200 OK`, JSON array |
| `CURL-04` (additional) | `GET /web/index.php/api/v2/pim/employees?...` without session cookie | `401 Unauthorized`, JSON error `Session expired` |

**Negative authentication observation:** The OrangeHRM employee endpoint returned `401 Unauthorized` when the request omitted the session cookie. The protected records were not returned. This checks missing-authentication behaviour. The session-cookie value copied from DevTools must never be included in this public repository.

**Evidence status:** Terminal screenshots were supplied in the conversation but have not been uploaded or linked as files in this folder.

## 7. Quick Revision

1. **Resource vs. endpoint:** Resource is the entity; endpoint is the address for interacting with it.
2. **Method vs. status:** The HTTP method specifies the requested action; the response status describes the result.
3. **JSON object vs. array:** Objects contain key-value pairs; arrays contain ordered items.
4. **Postman vs. cURL:** Both send HTTP requests; Postman offers a GUI and collections, cURL runs from a terminal.
5. **QA rule:** Always inspect status, headers, body and expected behaviour together.

## 8. Day 7 Practical Assignment — From the Foundation Programme

The official Day 7 assignment requires:

- A **sample REST API** tested with **at least 25 Postman requests**, covering **positive, negative and authentication** scenarios.
- **Three** of those requests executed with **cURL**.
- Submission to `day-07-api-testing` including the **exported Postman collection, cURL commands and findings**.

**Progress today:**

- [x] Reviewed the five Basic syllabus topics.
- [x] Executed three sample API GET requests with cURL (PowerShell screenshots observed).
- [x] Observed a negative unauthenticated OrangeHRM API request returning `401`.
- [ ] Create and save a Postman collection.
- [ ] Execute and record 25 Postman requests (including authentication cases).
- [ ] Record actual Postman outcomes; do not premark tests PASS.
- [ ] Export the Postman collection.
- [ ] Save sanitized cURL evidence and a final findings report.

**Next:** Continue with Day 7 Intermediate — response validation, authentication and negative testing — after completing the basic Postman workflow.

## References

- RoBenDevs QA Engineer Internship — 14-Day Foundation Programme, **Day 7**, PDF pp. 12–13.
- [JSONPlaceholder sample API](https://jsonplaceholder.typicode.com/)
- [Postman](https://www.postman.com/)
- [cURL](https://curl.se/)
