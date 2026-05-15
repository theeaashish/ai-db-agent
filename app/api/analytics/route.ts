import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { salesTable, productsTable } from "@/db/schema";
import { sql, count, sum, avg, desc, asc } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "overview";

  try {
    switch (type) {
      case "overview": {
        const [
          totalSales,
          totalRevenue,
          avgOrderValue,
          topProducts,
          salesByRegion,
        ] = await Promise.all([
          db.select({ count: count() }).from(salesTable),
          db.select({ total: sum(salesTable.total_amount) }).from(salesTable),
          db.select({ avg: avg(salesTable.total_amount) }).from(salesTable),
          db
            .select({
              name: productsTable.name,
              total_sold: sum(salesTable.quantity),
              revenue: sum(salesTable.total_amount),
            })
            .from(salesTable)
            .innerJoin(productsTable, salesTable.product_id.eq(productsTable.id))
            .groupBy(productsTable.name)
            .orderBy(desc(sum(salesTable.total_amount)))
            .limit(5),
          db
            .select({
              region: salesTable.region,
              total_sales: count(),
              revenue: sum(salesTable.total_amount),
            })
            .from(salesTable)
            .groupBy(salesTable.region)
            .orderBy(desc(sum(salesTable.total_amount))),
        ]);

        return NextResponse.json({
          total_sales: totalSales[0].count,
          total_revenue: totalRevenue[0].total || 0,
          avg_order_value: avgOrderValue[0].avg || 0,
          top_products: topProducts,
          sales_by_region: salesByRegion,
        });
      }

      case "low-stock": {
        const lowStockProducts = await db
          .select({
            id: productsTable.id,
            name: productsTable.name,
            category: productsTable.category,
            stock: productsTable.stock,
            price: productsTable.price,
          })
          .from(productsTable)
          .where(sql`${productsTable.stock} < 10`)
          .orderBy(asc(productsTable.stock));

        return NextResponse.json({
          count: lowStockProducts.length,
          products: lowStockProducts,
        });
      }

      case "top-customers": {
        const limit = parseInt(searchParams.get("limit") || "10");
        const topCustomers = await db
          .select({
            customer_name: salesTable.customer_name,
            total_orders: count(),
            total_spent: sum(salesTable.total_amount),
            avg_order: avg(salesTable.total_amount),
          })
          .from(salesTable)
          .groupBy(salesTable.customer_name)
          .orderBy(desc(sum(salesTable.total_amount)))
          .limit(limit);

        return NextResponse.json({ customers: topCustomers });
      }

      case "daily-sales": {
        const dailySales = await db
          .select({
            date: salesTable.sale_date,
            total_sales: count(),
            revenue: sum(salesTable.total_amount),
            quantity_sold: sum(salesTable.quantity),
          })
          .from(salesTable)
          .groupBy(salesTable.sale_date)
          .orderBy(desc(salesTable.sale_date))
          .limit(30);

        return NextResponse.json({ daily_sales: dailySales });
      }

      default:
        return NextResponse.json(
          { error: "Invalid type. Use: overview, low-stock, top-customers, or daily-sales" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
