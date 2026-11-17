
const http = require("http");

let stock = 1;
let orders = 0;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    // Handle URLs even when query parameters are present
    const pathname = new URL(
        req.url,
        "http://localhost:3000"
    ).pathname;

    function reply(statusCode, data) {
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    }

    // 1. Reset inventory before each experiment
    if (pathname === "/reset" && req.method === "POST") {
        stock = 1;
        orders = 0;

        return reply(200, {
            message: "Inventory reset",
            stock,
            orders
        });
    }

    // 2. Check current inventory
    if (pathname === "/state" && req.method === "GET") {
        return reply(200, {
            stock,
            orders
        });
    }

    // 3. UNSAFE API — Intentionally contains a race condition
    if (pathname === "/buy-unsafe" && req.method === "POST") {

        if (stock <= 0) {
            return reply(409, {
                message: "Out of stock"
            });
        }

        // Delay allows two requests to pass the stock check
        setTimeout(() => {
            stock--;
            orders++;

            reply(200, {
                message: "Purchase successful",
                stock,
                orders
            });
        }, 200);

        return;
    }

    // 4. SAFE API — Fixes the race in this local lab
    if (pathname === "/buy-safe" && req.method === "POST") {

        if (stock <= 0) {
            return reply(409, {
                message: "Out of stock"
            });
        }

        // Update stock immediately before any asynchronous work
        stock--;
        orders++;

        const remainingStock = stock;
        const totalOrders = orders;

        setTimeout(() => {
            reply(200, {
                message: "Purchase successful",
                stock: remainingStock,
                orders: totalOrders
            });
        }, 200);

        return;
    }

    // 5. Handle unknown endpoints
    reply(404, {
        message: "Not found"
    });
});

// Start local server
server.listen(3000, "127.0.0.1", () => {
    console.log(
        "Race condition lab running at http://127.0.0.1:3000"
    );
});
