// Day 08 authorization lab: deliberately small, local-only fixture.
// Run: node day-08-advanced-api-testing/api-tests/authorization-lab.js
// Do not expose this mock-auth server to the public internet.

const http = require("http");

const profiles = {
  "user-a": { id: "user-a", displayName: "Demo User A", role: "customer" },
  "user-b": { id: "user-b", displayName: "Demo User B", role: "customer" }
};

const demoTokens = {
  "demo-token-a": "user-a",
  "demo-token-b": "user-b"
};

function send(res, code, data) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:3001");

  if (req.method !== "GET" || !url.pathname.startsWith("/users/")) {
    return send(res, 404, { message: "Endpoint not found" });
  }

  const requestedId = decodeURIComponent(url.pathname.slice("/users/".length));

  if (!Object.prototype.hasOwnProperty.call(profiles, requestedId)) {
    return send(res, 404, { message: "Profile not found" });
  }

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const callerId = demoTokens[token];

  if (!callerId) {
    return send(res, 401, { message: "Authentication required" });
  }

  // Object-level authorization: do not disclose another user's profile.
  if (callerId !== requestedId) {
    return send(res, 403, { message: "Access denied" });
  }

  return send(res, 200, profiles[requestedId]);
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Authorization lab running at http://127.0.0.1:3001");
});
