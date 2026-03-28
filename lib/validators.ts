// gitscribe-test: include: validate that SQL injection patterns are detected
// gitscribe-test: include: validate that safe queries pass validation
// gitscribe-test: include: validate that empty query strings are rejected
// gitscribe-test: exclude: skip actual database execution during validation

const DANGEROUS_SQL_KEYWORDS = [
  "DROP",
  "DELETE",
  "TRUNCATE",
  "ALTER",
  "CREATE",
  "INSERT",
  "UPDATE",
  "GRANT",
  "REVOKE",
  "EXEC",
  "EXECUTE",
];

const SQL_INJECTION_PATTERNS = [
  /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER)/i,
  /'\s*OR\s*'1'\s*=\s*'1/i,
  /"\s*OR\s*"1"\s*=\s*"1/i,
  /--\s*$/,
  /\/\*.*\*\//,
  /UNION\s+ALL\s+SELECT/i,
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

// Validates SQL query for safety
export function validateSqlQuery(query: string): ValidationResult {
  const errors: string[] = [];

  if (!query || typeof query !== "string") {
    return { isValid: false, errors: ["Query must be a non-empty string"] };
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { isValid: false, errors: ["Query cannot be empty"] };
  }

  if (trimmed.length > 10_000) {
    errors.push("Query exceeds maximum length of 10,000 characters");
  }

  const upperQuery = trimmed.toUpperCase();

  for (const keyword of DANGEROUS_SQL_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(upperQuery)) {
      errors.push(`Dangerous SQL keyword detected: ${keyword}`);
    }
  }

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      errors.push("Potential SQL injection pattern detected");
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? trimmed : undefined,
  };
}

// Checks if a string is a valid table name
export function isValidTableName(name: string): boolean {
  if (!name || typeof name !== "string") return false;
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) && name.length <= 64;
}

// Validates user chat message input
export function validateChatMessage(message: string): ValidationResult {
  const errors: string[] = [];

  if (!message || typeof message !== "string") {
    return { isValid: false, errors: ["Message must be a non-empty string"] };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { isValid: false, errors: ["Message cannot be empty"] };
  }

  if (trimmed.length > 5000) {
    errors.push("Message exceeds maximum length of 5,000 characters");
  }

  if (/\x00/.test(trimmed)) {
    errors.push("Message contains invalid null characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? trimmed : undefined,
  };
}
