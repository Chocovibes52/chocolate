type Captured = { error: unknown; at: number };
let lastCapturedError: Captured | undefined;
const TTL_MS = 5000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

const CAUSE_DEPTH_LIMIT = 5;
const DESCRIPTION_LENGTH_LIMIT = 8000;

function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
    if (!(current instanceof Error)) {
      parts.push(
        typeof current === "string" ? current : safeStringify(current),
      );
      break;
    }
    const label = depth === 0 ? "" : "caused by: ";
    const status = describeStatus(current);
    parts.push(
      `${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`,
    );
    current = (current as Error).cause;
  }
  return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}

function describeStatus(error: unknown): string {
  const err = error as { status?: unknown; statusCode?: unknown };
  const value = err?.status ?? err?.statusCode;
  return typeof value === "number" ? ` (status ${value})` : "";
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function isErrorLike(value: unknown): value is Error {
  return value instanceof Error;
}

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  originalConsoleError(
    ...args.map((arg) => {
      if (!isErrorLike(arg)) return arg;
      record(arg);
      return describeError(arg);
    }),
  );
};

if (typeof globalThis.addEventListener === "function") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.addEventListener("error", (event: any) =>
    record(event.error ?? event),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.addEventListener("unhandledrejection", (event: any) =>
    record(event.reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
