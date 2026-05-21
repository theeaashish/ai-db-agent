# API Route: `app/api/chat/route.ts`

This file implements the backend API route for the AI-powered database assistant. It handles incoming chat messages, processes them using the Google Gemini model, and orchestrates database interactions via defined tools.

## Overview
The route uses the Vercel AI SDK to stream responses. It acts as an intelligent agent that translates natural language requests into SQL queries, executes them against the database, and optionally formats the results into structured reports.

## Key Components

### 1. System Prompt
The agent is configured with a strict system prompt that defines its persona as an expert SQL assistant. It enforces safety rules, such as:
*   **Read-only access:** Only `SELECT` queries are permitted.
*   **Tool-first approach:** The agent must use the provided tools rather than simply outputting raw SQL text.

### 2. Tools
The agent is equipped with three primary tools to interact with the system:

*   **`schema`**: Returns the database schema (DDL for `products` and `sales` tables). This allows the model to understand the database structure before generating queries.
*   **`db`**: Executes SQL queries against the database using the `db` client.
*   **`generate_report`**: Takes raw data and formats it into a structured document (title, summary, and sections) for better user presentation.

### 3. Configuration
*   **Model**: Uses `google('gemini-2.5-flash')`.
*   **Streaming**: Utilizes `streamText` to provide real-time feedback to the user.
*   **Constraints**: 
    *   `maxDuration`: Set to 30 seconds.
    *   `stopWhen`: Limits the agent to a maximum of 10 steps to prevent infinite loops.

## How it Works
1.  **Request**: The client sends a list of `UIMessage` objects via a `POST` request.
2.  **Processing**: The `streamText` function processes the conversation history and the system prompt.
3.  **Tool Execution**:
    *   If the model determines it needs schema information, it calls `schema`.
    *   If it needs to fetch data, it calls `db` with a generated SQL query.
    *   If the user requests a report, it calls `generate_report` to structure the data.
4.  **Response**: The result is streamed back to the client as a `UIMessageStreamResponse`, which is consumed by the `useChat` hook in `app/page.tsx`.

## Usage
This route is intended to be consumed by the frontend chat interface. It does not require manual invocation; the `useChat` hook from the `@ai-sdk/react` library handles the communication automatically when `sendMessage` is called.