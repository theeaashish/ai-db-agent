# Validator Module

This module provides utility functions for validating payment-related data, specifically credit card numbers (using the Luhn algorithm) and expiration dates. It also includes an asynchronous function for processing payments, which relies on external API calls (and is noted as excluded from standard testing).

## Exports

### `validateCardNumber(cardNumber: string): boolean`

Validates a credit card number string using the Luhn algorithm and format checks.

This function cleans the input by removing spaces and dashes, then verifies that the resulting string contains between 13 and 19 digits before applying the Luhn check.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `cardNumber` | `string` | The raw credit card number string. |

**Returns:**

`true` if the card number is valid according to the Luhn check and length requirements, `false` otherwise.

### `validateExpiry(month: number, year: number): boolean`

Validates that a given month and year combination represents a future or current expiration date.

It checks that the year is not in the past, and if the year is the current year, the month must be the current month or later.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `month` | `number` | The expiration month (1-12). |
| `year` | `number` | The four-digit expiration year. |

**Returns:**

`true` if the expiry date is valid (current or future), `false` otherwise.

### `processPayment(amount: number, cardToken: string, merchantId: string): Promise<{ success: boolean; transactionId?: string; error?: string }>`

Asynchronously processes a payment charge using an external API endpoint (`/api/stripe/charge`).

**Note:** This function involves external API interaction and is typically excluded from unit tests.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `amount` | `number` | The monetary amount to charge. |
| `cardToken` | `string` | A tokenized representation of the card details. |
| `merchantId` | `string` | The identifier for the merchant processing the charge. |

**Returns:**

A `Promise` that resolves to an object indicating the success status, along with a `transactionId` on success or an `error` message on failure.