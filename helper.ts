// Add this around the suspected hanging section

const withTimeout = async <T>(
  promise: Promise<T>,
  label: string,
  ms = 30000
): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`[TIMEOUT] ${label} exceeded ${ms}ms`));
    }, ms);
  });

  const start = Date.now();

  try {
    console.log(`[START] ${label}`);

    const result = await Promise.race([promise, timeout]);

    console.log(
      `[DONE] ${label} completed in ${Date.now() - start}ms`
    );

    return result;
  } catch (err) {
    console.error(
      `[FAILED] ${label} after ${Date.now() - start}ms`,
      err
    );
    throw err;
  }
};
