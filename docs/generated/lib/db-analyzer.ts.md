# Database Analyzer (`lib/db-analyzer.ts`)

The `DatabaseAnalyzer` class provides utility methods to inspect SQLite/LibSQL database performance and schema health. It is designed to help developers identify inefficient queries and missing database indexes.

## Key Functionality

### 1. Query Performance Analysis
*   **`explainQuery(query: string)`**: Executes `EXPLAIN QUERY PLAN` on a provided `SELECT` statement. It parses the raw database output into a structured `QueryExplanation` format.
*   **`analyzeQueryPlan(explanations: QueryExplanation[])`**: Evaluates the output of `explainQuery` to generate actionable `OptimizationRecommendation` objects. It detects:
    *   **Full Table Scans**: Suggests adding indexes for better lookup performance.
    *   **Temporary B-Trees**: Identifies inefficient sorting or grouping operations.
    *   **Un-indexed Lookups**: Flags searches that bypass existing indexes.

### 2. Schema Inspection
*   **`analyzeSchema()`**: Scans the database to retrieve metadata for all user-defined tables, including:
    *   Row counts.
    *   Column counts.
    *   Existing index names.
*   **`suggestMissingIndexes()`**: Automatically identifies potential performance bottlenecks by checking if foreign key columns are missing corresponding indexes. It generates `CREATE INDEX` SQL statements for identified gaps.

## Data Structures

### `QueryExplanation`
Represents the execution plan of a query.
*   `selectid`, `order`, `from`: Internal SQLite execution identifiers.
*   `detail`: The human-readable description of the operation (e.g., "SCAN TABLE").

### `OptimizationRecommendation`
Provides actionable advice for database tuning.
*   `type`: Categorized as `INDEX`, `REWRITE`, or `PERFORMANCE`.
*   `impact`: Severity level (`HIGH`, `MEDIUM`, `LOW`).
*   `sql`: Optional SQL snippet to apply the recommended fix.

## Usage Example

```typescript
import { DatabaseAnalyzer } from "@/lib/db-analyzer";

// 1. Analyze a specific query
const plan = await DatabaseAnalyzer.explainQuery("SELECT * FROM sales WHERE region = 'North'");
const recommendations = DatabaseAnalyzer.analyzeQueryPlan(plan);

// 2. Get automated schema suggestions
const indexSuggestions = await DatabaseAnalyzer.suggestMissingIndexes();

console.log(recommendations);
console.log(indexSuggestions);
```

## Dependencies
*   **`@/db/db`**: The underlying database connection instance.
*   **`drizzle-orm`**: Used for executing raw SQL queries safely against the database.

## Integration Notes
This utility is intended to be used alongside the `validateSqlQuery` function in `lib/validators.ts` to ensure that only safe, valid queries are passed to the analyzer. It is particularly useful for building administrative dashboards or AI-assisted database management tools.