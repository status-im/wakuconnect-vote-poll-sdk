export function isTruthy<T>(e: T | undefined | null): e is T {
  return !!e
}
