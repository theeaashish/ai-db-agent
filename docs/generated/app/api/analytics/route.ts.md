# Analytics API Route

The `app/api/analytics/route.ts` file provides a dedicated API endpoint for retrieving aggregated business intelligence and sales metrics. It leverages **Drizzle ORM** to perform complex SQL aggregations on the `sales` and `products` tables.

## Purpose
This route serves as the backend data provider for the application's analytics dashboard. It allows the frontend to request specific data slices (e.g., top customers, low stock alerts, or daily revenue) via query parameters.

## API Usage

**Endpoint:** `GET /api/analytics?type=[type]`

### Supported Types

| Type | Description |
| :--- | :--- |
| `overview` | Returns high-level metrics: total sales count, total revenue, average order value, top 5 products, and regional performance. |
| `low-stock` | Returns a list of products where stock levels are below 10 units. |
| `top-customers` | Returns a list of customers ranked by total spend. Supports an optional `limit` parameter (default: 10). |
| `daily-sales` | Returns the last 30 days of sales data, including revenue and quantity sold per day. |

## Key Components

### Database Integration
*   **Drizzle ORM:** Used for type-safe SQL construction.
*   **Aggregations:** Utilizes `count()`, `sum()`, and `avg()` functions to process raw sales data into meaningful business metrics.
*   **Joins:** Performs an `innerJoin` between `salesTable` and `productsTable` to associate product names with sales records for the `overview` report.

### Error Handling
*   **Validation:** Returns a `400 Bad Request` if an unsupported `type` is provided.
*   **Resilience:** Wraps database operations in a `try/catch` block, returning a `500 Internal Server Error` if the database query fails, ensuring the API does not crash the server.

## Example Requests

**Fetch the dashboard overview:**
```bash
GET /api/analytics?type=overview
```

**Fetch top 5 customers:**
```bash
GET /api/analytics?type=top-customers&limit=5
```

## Relationship to Other Components
*   **`app/api/chat/route.ts`**: While the chat route uses LLM-driven SQL generation for ad-hoc queries, this analytics route provides a performant, pre-defined API for standard dashboard widgets.
*   **`db/schema.ts`**: Relies on the defined `salesTable` and `productsTable` schemas to execute queries.