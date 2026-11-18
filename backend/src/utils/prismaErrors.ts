function hasErrorCode(
    error: unknown,
    code: string,
    visited: Set<object>
): boolean {
    if (typeof error !== "object" || error === null || visited.has(error)) {
        return false;
    }
    visited.add(error);

    if ("code" in error && error.code === code) return true;
    if ("originalCode" in error && error.originalCode === code) return true;
    if ("database_error" in error &&
        typeof error.database_error === "string" &&
        error.database_error.includes(code)) {
        return true;
    }

    return ["meta", "cause", "driverAdapterError"].some(key =>
        key in error && hasErrorCode(Reflect.get(error, key), code, visited)
    );
}

export function hasPostgresErrorCode(error: unknown, code: string): boolean {
    return hasErrorCode(error, code, new Set());
}

export function isConstraintViolation(error: unknown): boolean {
    return hasPostgresErrorCode(error, "23P01") ||
        hasPostgresErrorCode(error, "23514") ||
        hasPostgresErrorCode(error, "P2004");
}
