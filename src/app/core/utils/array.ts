/**
 * Returns a new array with the item at `index` moved one slot in `direction`.
 * Out-of-range moves (first item up, last item down) return the array
 * unchanged. Pure — never mutates the input.
 */
export function moveItem<T>(
  items: readonly T[],
  index: number,
  direction: "up" | "down",
): T[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) {
    return [...items];
  }
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
