import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query database using natural language.
  
  you have access to following tools:
  1. schema tool - call this tool to get the database schrema which will help you to write SQL queries.
  2. db tool - call this tool to execute SQL queries against the database.

  Rules:
  - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
  - Always use the schema provided by the schema tool
  - Return valid SQLite syntax

  Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: {
      db: tool({
        description:
          'Retrieve data from the database when the user asks for information stored in it (e.g., user details, task lists, statistics, logs). Accepts parameters like table name, filters, date range, and fields to query, and returns structured data matching the request.',
        inputSchema: z.object({
          query: z.string().describe('The SQL query to execute against the database.'),
        }),
        execute: async ({ query }) => {
          console.log(query);

          return '';
        }
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
