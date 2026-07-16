import { describe, it, expect } from "vitest";
import { A4 } from "./a4";

describe("A4 constants", () => {
  it("uses standard A4 millimetre dimensions", () => {
    expect(A4.WIDTH_MM).toBe(210);
    expect(A4.HEIGHT_MM).toBe(297);
  });

  it("keeps the px dimensions consistent with 96 DPI (~3.78 px/mm)", () => {
    const pxPerMmWidth = A4.WIDTH_PX / A4.WIDTH_MM;
    const pxPerMmHeight = A4.HEIGHT_PX / A4.HEIGHT_MM;
    expect(pxPerMmWidth).toBeCloseTo(3.78, 1);
    expect(pxPerMmHeight).toBeCloseTo(3.78, 1);
  });

  it("preserves the A4 aspect ratio between mm and px", () => {
    expect(A4.WIDTH_PX / A4.HEIGHT_PX).toBeCloseTo(
      A4.WIDTH_MM / A4.HEIGHT_MM,
      2,
    );
  });
});
