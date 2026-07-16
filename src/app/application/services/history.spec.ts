import { describe, it, expect, beforeEach, vi } from "vitest";
import { History } from "./history";
import { Cv } from "../../domain/models/cv-model";
import { createDefaultCv } from "../../domain/models/cv-defaults";

function makeCv(name: string): Cv {
  const cv = createDefaultCv();
  cv.name = name;
  cv.sections.personal.fullName = name;
  return cv;
}

describe("History", () => {
  let history: History;

  beforeEach(() => {
    history = new History();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with no undo/redo", () => {
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
    expect(history.undo()).toBeNull();
    expect(history.redo()).toBeNull();
  });

  it("records a snapshot and allows undo/redo", () => {
    const a = makeCv("A");
    history.reset(a);
    expect(history.canUndo()).toBe(false);

    history.push(makeCv("B"));
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);

    const undone = history.undo();
    expect(undone?.name).toBe("A");
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(true);

    const redone = history.redo();
    expect(redone?.name).toBe("B");
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);
  });

  it("coalesces rapid pushes into a single snapshot", () => {
    const a = makeCv("A");
    history.reset(a);

    history.push(makeCv("B"));
    vi.advanceTimersByTime(500);
    history.push(makeCv("C"));

    expect(history.canUndo()).toBe(true);
    expect(history.undo()?.name).toBe("A");
    expect(history.redo()?.name).toBe("C");
  });

  it("does not coalesce pushes separated by more than 1s", () => {
    const a = makeCv("A");
    history.reset(a);

    history.push(makeCv("B"));
    vi.advanceTimersByTime(1100);
    history.push(makeCv("C"));

    expect(history.undo()?.name).toBe("B");
    expect(history.undo()?.name).toBe("A");
  });

  it("drops redo entries when pushing after an undo", () => {
    const a = makeCv("A");
    history.reset(a);
    history.push(makeCv("B"));
    vi.advanceTimersByTime(1100);
    history.push(makeCv("C"));

    history.undo();
    vi.advanceTimersByTime(1100);
    history.push(makeCv("D"));

    expect(history.canRedo()).toBe(false);
    expect(history.undo()?.name).toBe("B");
    expect(history.undo()?.name).toBe("A");
  });

  it("limits the stack to 50 snapshots", () => {
    const a = makeCv("A");
    history.reset(a);

    for (let i = 0; i < 55; i++) {
      vi.advanceTimersByTime(1100);
      history.push(makeCv(`V${i}`));
    }

    // After 55 pushes the oldest (A and V0..V3) should have been dropped.
    expect(history.undo()?.name).toBe("V53");
  });

  it("returns independent clones", () => {
    const a = makeCv("A");
    history.reset(a);
    const pushed = makeCv("B");
    history.push(pushed);

    pushed.name = "Mutated";
    expect(history.undo()?.name).toBe("A");
    expect(history.redo()?.name).toBe("B");
  });
});
