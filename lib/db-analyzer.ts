import { db } from "@/db/db";
import { sql } from "drizzle-orm";

export interface QueryExplanation {
  selectid: number;
  order: number;
  from: number;
  detail: string;
}

export interface OptimizationRecommendation {
  type: "INDEX" | "REWRITE" | "PERFORMANCE";
  impact: "HIGH" | "MEDIUM" | "LOW";
  table?: string;
  column?: string;
  description: string;
  rationale: string;
  sql?: string;
}

export interface SchemaAnalysis {
  tableName: string;
  rowCount: number;
  columnCount: number;
  indexes: string[];
}

export class DatabaseAnalyzer {
  /**
   * Explains a query using SQLite/LibSQL EXPLAIN QUERY PLAN
   */
  static async explainQuery(query: string): Promise<QueryExplanation[]> {
    if (!query.trim().toLowerCase().startsWith("select")) {
      throw new Error("Only SELECT queries can be analyzed for performance.");
    }

    try {
      const explainSql = `EXPLAIN QUERY PLAN ${query}`;
      const result = await db.run(sql.raw(explainSql));
      
      // Map raw rows to QueryExplanation
      return (result.rows as any[]).map((row) => ({
        selectid: Number(row.selectid ?? row[0]),
        order: Number(row.order ?? row[1]),
        from: Number(row.from ?? row[2]),
        detail: String(row.detail ?? row[3]),
      }));
    } catch (error) {
      console.error("Failed to explain query:", error);
      throw new Error(`Query explanation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Analyzes the query plan explanation and returns concrete recommendations
   */
  static analyzeQueryPlan(explanations: QueryExplanation[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    for (const exp of explanations) {
      const detail = exp.detail.toLowerCase();

      // Check for full table scan
      if (detail.includes("scan table")) {
        // Extract table name: "SCAN TABLE products" or similar
        const match = exp.detail.match(/SCAN TABLE\s+(\w+)/i);
        const tableName = match ? match[1] : undefined;

        recommendations.push({
          type: "INDEX",
          impact: "HIGH",
          table: tableName,
          description: `Full table scan detected on table "${tableName || 'unknown'}".`,
          rationale: "Scanning an entire table is highly inefficient for large datasets. Adding a targeted index on fields used in your WHERE, JOIN, or ORDER BY clauses will significantly speed up retrieval.",
          sql: tableName ? `CREATE INDEX idx_${tableName}_search ON ${tableName} (/* column_name */);` : undefined,
        });
      }

      // Check for sorting search (temp B-Tree used for ORDER BY)
      if (detail.includes("use temp b-tree for group by") || detail.includes("use temp b-tree for order by")) {
        recommendations.push({
          type: "PERFORMANCE",
          impact: "MEDIUM",
          description: "Temporary B-Tree structure is being used for sorting or grouping operations.",
          rationale: "SQLite creates a temporary B-Tree when sorting cannot be resolved using existing indexes. This consumes extra CPU and memory. Creating an index that includes the columns in the ORDER BY or GROUP BY clause in matching order can eliminate this overhead.",
        });
      }

      // Check for un-indexed search
      if (detail.includes("search table") && !detail.includes("using index") && !detail.includes("using cover index")) {
        const match = exp.detail.match(/SEARCH TABLE\s+(\w+)/i);
        const tableName = match ? match[1] : undefined;

        recommendations.push({
          type: "INDEX",
          impact: "HIGH",
          table: tableName,
          description: `Un-indexed lookup on table "${tableName || 'unknown'}".`,
          rationale: "The database is searching this table without utilizing an index. An index covering the filter conditions in the WHERE or JOIN clauses will prevent sequential scans.",
        });
      }
    }

    // Default recommendation if everything is highly optimized
    if (recommendations.length === 0 && explanations.length > 0) {
      recommendations.push({
        type: "PERFORMANCE",
        impact: "LOW",
        description: "Excellent query plan structure. The query is fully utilizing existing indexes.",
        rationale: "Your query plan uses covering indexes or direct primary key access. No manual indexing is required for this specific statement.",
      });
    }

    return recommendations;
  }

  /**
   * Inspects database schemas and finds tables, column counts, indexes, and row counts
   */
  static async analyzeSchema(): Promise<SchemaAnalysis[]> {
    try {
      // 1. Get all user tables
      const tablesResult = await db.run(
        sql.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'drizzle_%'")
      );
      
      const tables = (tablesResult.rows as any[]).map((row) => String(row.name ?? row[0]));
      const schemaReports: SchemaAnalysis[] = [];

      for (const table of tables) {
        // 2. Count rows
        const countResult = await db.run(sql.raw(`SELECT COUNT(*) as count FROM ${table}`));
        const rowCount = Number((countResult.rows[0] as any)?.count ?? (countResult.rows[0] as any)?.[0] ?? 0);

        // 3. Get table info (columns)
        const infoResult = await db.run(sql.raw(`PRAGMA table_info(${table})`));
        const columnCount = infoResult.rows.length;

        // 4. Get table indexes
        const indexResult = await db.run(sql.raw(`PRAGMA index_list(${table})`));
        const indexes = (indexResult.rows as any[]).map((row) => String(row.name ?? row[1]));

        schemaReports.push({
          tableName: table,
          rowCount,
          columnCount,
          indexes,
        });
      }

      return schemaReports;
    } catch (error) {
      console.error("Schema analysis failed:", error);
      throw new Error(`Failed to analyze database schema: ${(error as Error).message}`);
    }
  }

  /**
   * Suggests missing indexes by scanning the database structure.
   * e.g., finding foreign keys that don't have matching indexes.
   */
  static async suggestMissingIndexes(): Promise<OptimizationRecommendation[]> {
    const suggestions: OptimizationRecommendation[] = [];

    try {
      // 1. Get all tables
      const schemas = await this.analyzeSchema();

      for (const schema of schemas) {
        const table = schema.tableName;
        
        // 2. Fetch foreign keys for this table
        const fkResult = await db.run(sql.raw(`PRAGMA foreign_key_list(${table})`));
        const foreignKeys = (fkResult.rows as any[]).map((row) => ({
          from: String(row.from ?? row[3]),
          table: String(row.table ?? row[2]),
          to: String(row.to ?? row[4]),
        }));

        for (const fk of foreignKeys) {
          // Check if there is an index covering this local foreign key column ('from')
          let hasIndex = false;
          
          for (const idxName of schema.indexes) {
            const idxInfo = await db.run(sql.raw(`PRAGMA index_info(${idxName})`));
            const columns = (idxInfo.rows as any[]).map((row) => String(row.name ?? row[2]));
            if (columns.includes(fk.from)) {
              hasIndex = true;
              break;
            }
          }

          if (!hasIndex) {
            suggestions.push({
              type: "INDEX",
              impact: "HIGH",
              table,
              column: fk.from,
              description: `Missing index on foreign key column "${table}.${fk.from}" referencing "${fk.table}.${fk.to}".`,
              rationale: `Foreign keys are frequently used in JOIN statements. Under-indexed foreign key columns require full table scans whenever tables are joined, dragging down query performance.`,
              sql: `CREATE INDEX idx_${table}_${fk.from} ON ${table} (${fk.from});`,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to suggest missing indexes:", error);
    }

    return suggestions;
  }
}
