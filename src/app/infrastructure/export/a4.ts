/**
 * Shared A4 page constants used across export services.
 *
 * Centralises all A4 dimension references so they remain
 * consistent between print-based and image-based exports.
 */
export const A4 = {
  /** Width in millimetres */
  WIDTH_MM: 210,
  /** Height in millimetres */
  HEIGHT_MM: 297,
  /** Width in pixels at 96 DPI */
  WIDTH_PX: 794,
  /** Height in pixels at 96 DPI */
  HEIGHT_PX: 1123,
} as const;
