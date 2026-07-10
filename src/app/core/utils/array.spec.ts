import { describe, it, expect } from "vitest";
import { moveItem } from "./array";

describe("moveItem", () => {
  it("moves an item up", () => {
    expect(moveItem(["a", "b", "c"], 1, "up")).toEqual(["b", "a", "c"]);
  });

  it("moves an item down", () => {
    expect(moveItem(["a", "b", "c"], 1, "down")).toEqual(["a", "c", "b"]);
  });

  it("is a no-op when moving the first item up", () => {
    expect(moveItem(["a", "b"], 0, "up")).toEqual(["a", "b"]);
  });

  it("is a no-op when moving the last item down", () => {
    expect(moveItem(["a", "b"], 1, "down")).toEqual(["a", "b"]);
  });

  it("does not mutate the input array", () => {
    const input = ["a", "b", "c"];
    moveItem(input, 0, "down");
    expect(input).toEqual(["a", "b", "c"]);
  });
});
