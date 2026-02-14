// Standard API response format.

export function success<T>(data: T) {
  return {
    success: true,
    data,
  };
}

export function failure(message: string) {
  return {
    success: false,
    error: message,
  };
}
