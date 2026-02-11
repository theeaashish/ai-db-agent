type LogLevel = "info" | "warn" | "error" | "debug";

const isDev = process.env.NODE_ENV !== "production";

function log(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();

  const payload = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };

  if (level === "error") {
    console.error(payload);
  } else if (isDev) {
    console.log(payload);
  }
}

export const logger = {
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
};

