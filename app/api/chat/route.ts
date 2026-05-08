import { db } from '@/db/db';
import { google } from '@ai-sdk/google';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query database using natural language.
  
  you have access to following tools:
  1. schema tool - call this tool to get the database schrema which will help you to write SQL queries.
  2. db tool - call this tool to execute SQL queries against the database.
  3. generate_report tool - call this tool to generate a structured report or document based on the data you retrieved.

  Rules:
  - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
  - Always use the schema provided by the schema tool
  - Pass in valid SQL syntax in db tool.
  - IMPORTANT: To query database call db tool, Don't return just SQL query.
  - After getting data from the database, if the user asked for a report, document, or summary, use the generate_report tool.

  Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(10),
    tools: {
      schema: tool({
        description: 'Call this tool to get the database schema infromation.',
        inputSchema: z.object({
          query: z
            .string()
            .describe('The SQL query to execute against the database.'),
        }),
        execute: async () => {
          return `
          CREATE TABLE products (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price real NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_at text DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE sales (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    total_amount real NOT NULL,
    sale_date text DEFAULT CURRENT_TIMESTAMP,
    customer_name text NOT NULL,
    region text NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
  );
          `;
        },
      }),
      db: tool({
        description: 'Call this tool to query a database.',
        inputSchema: z.object({
          query: z
            .string()
            .describe('The SQL query to execute against the database.'),
        }),
        execute: async ({ query }) => {
          const data = await db.run(query);
          return data;
        },
      }),
      generate_report: tool({
        description: 'Call this tool to generate a structured report or document based on data.',
        inputSchema: z.object({
          title: z.string().describe('The title of the report.'),
          summary: z.string().describe('A brief summary of what the report contains.'),
          sections: z.array(z.object({
            heading: z.string(),
            content: z.string().describe('The content for this section (can be markdown).'),
            data: z.any().optional().describe('Raw data related to this section.'),
          })).describe('The sections of the report.'),
        }),
        execute: async (args) => {
          return {
            ...args,
            generatedAt: new Date().toISOString(),
            documentId: Math.random().toString(36).substring(7),
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
