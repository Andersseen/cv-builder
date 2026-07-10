import { describe, it, expect } from "vitest";
import { deepMerge } from "./deep-merge";

describe("deepMerge", () => {
  it("merges nested objects recursively", () => {
    const target = { settings: { accentColor: "#000", fontFamily: "Inter" } };
    const result = deepMerge(target, { settings: { accentColor: "#fff" } });
    expect(result.settings).toEqual({ accentColor: "#fff", fontFamily: "Inter" });
  });

  it("replaces arrays wholesale instead of merging them", () => {
    const target = { skills: [{ id: "a" }, { id: "b" }] };
    const result = deepMerge(target, { skills: [{ id: "c" }] });
    expect(result.skills).toEqual([{ id: "c" }]);
  });

  it("does not mutate the original target", () => {
    const target = { sections: { personal: { fullName: "Ana" } } };
    deepMerge(target, { sections: { personal: { fullName: "Bea" } } });
    expect(target.sections.personal.fullName).toBe("Ana");
  });

  it("overwrites primitives", () => {
    const result = deepMerge({ name: "old" }, { name: "new" });
    expect(result.name).toBe("new");
  });

  it("returns an equivalent object when the patch is empty", () => {
    const target = { a: 1, b: { c: 2 } };
    expect(deepMerge(target, {})).toEqual(target);
  });
});
