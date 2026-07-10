/**
 * Deep-merges a partial patch into a target object.
 *
 * Semantics (must match how CvStore applies DeepPartial<Cv> patches):
 *   - Plain objects are merged recursively.
 *   - Arrays and primitives are replaced wholesale.
 *
 * Pure TypeScript — no Angular, no side effects. Kept in its own module so it
 * can be unit-tested without the DI container.
 */
export type DeepPartialObj<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialObj<T[P]> : T[P];
};

export function deepMerge<T extends object>(
  target: T,
  source: DeepPartialObj<T>,
): T {
  const result = { ...target };

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      (result as Record<string, unknown>)[key as string] = deepMerge(
        targetVal as object,
        sourceVal as DeepPartialObj<object>,
      );
    } else {
      (result as Record<string, unknown>)[key as string] = sourceVal;
    }
  }

  return result;
}
