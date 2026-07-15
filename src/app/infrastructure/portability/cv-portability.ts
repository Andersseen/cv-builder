import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv-model";
import { migrateCv } from "../../domain/models/cv-migration";

/**
 * JSON envelope version. Bump when the on-disk shape changes in a
 * backward-incompatible way so future migrations can detect old exports.
 */
export const CV_JSON_SCHEMA_VERSION = 1;

export interface CvExportEnvelope {
  schemaVersion: number;
  cv: Cv;
}

export interface CvBackupEnvelope {
  schemaVersion: number;
  cvs: Cv[];
}

export type ImportResult =
  | { success: true; cv: Cv }
  | { success: false; error: string };

export type ImportAllResult =
  | { success: true; cvs: Cv[] }
  | { success: false; error: string };

/** Build a single-CV export envelope without side effects. */
export function createCvExportEnvelope(cv: Cv): CvExportEnvelope {
  return {
    schemaVersion: CV_JSON_SCHEMA_VERSION,
    cv,
  };
}

/** Build a multi-CV backup envelope without side effects. */
export function createBackupEnvelope(cvs: Cv[]): CvBackupEnvelope {
  return {
    schemaVersion: CV_JSON_SCHEMA_VERSION,
    cvs,
  };
}

/**
 * Import/export of CVs as portable JSON files.
 *
 * Single-CV exports use a `{ schemaVersion, cv }` envelope so we can evolve
 * the format later. Backups use `{ schemaVersion, cvs }`.
 */
@Injectable({ providedIn: "root" })
export class CvPortability {
  /** Export one CV as a downloadable `<name>.cv.json` file. */
  exportCv(cv: Cv): void {
    const envelope = createCvExportEnvelope(cv);
    const filename = this.sanitizeFilename(cv.name, ".cv.json");
    this.downloadJson(envelope, filename);
  }

  /** Export all CVs as a single downloadable backup file. */
  exportAll(cvs: Cv[]): void {
    const envelope = createBackupEnvelope(cvs);
    this.downloadJson(envelope, `cv-builder-backup.cv.json`);
  }

  /**
   * Import a single-CV JSON file.
   * Regenerates the id if it collides with an existing id.
   */
  async importCv(
    file: File,
    existingIds: Set<string>,
  ): Promise<ImportResult> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const cv = this.extractCv(parsed);
      if (!cv) {
        return { success: false, error: "Invalid CV file format." };
      }
      const imported = this.ensureUniqueId(cv, existingIds);
      return { success: true, cv: imported };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read file.";
      return { success: false, error: message };
    }
  }

  /** Import a backup file containing multiple CVs. */
  async importAll(
    file: File,
    existingIds: Set<string>,
  ): Promise<ImportAllResult> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.cvs)) {
        return { success: false, error: "Invalid backup file format." };
      }

      const imported: Cv[] = [];
      const usedIds = new Set(existingIds);
      for (const item of parsed.cvs) {
        const cv = this.extractCv({ cv: item });
        if (!cv) {
          return { success: false, error: "Backup contains invalid CV entries." };
        }
        const unique = this.ensureUniqueId(cv, usedIds);
        usedIds.add(unique.id);
        imported.push(unique);
      }
      return { success: true, cvs: imported };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read file.";
      return { success: false, error: message };
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private extractCv(parsed: unknown): Cv | null {
    if (!parsed || typeof parsed !== "object") return null;

    const envelope = parsed as { cv?: unknown };
    const cv = migrateCv(envelope.cv);
    if (!cv) return null;

    return cv;
  }

  private ensureUniqueId(cv: Cv, existingIds: Set<string>): Cv {
    if (!existingIds.has(cv.id)) return cv;
    return { ...cv, id: crypto.randomUUID() };
  }

  private downloadJson(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  private sanitizeFilename(name: string, suffix: string): string {
    const base = name.trim() || "Untitled Resume";
    const safe = base.replace(/[^a-zA-Z0-9\u00C0-\u017F\-_ ]+/g, "").trim();
    return `${safe || "resume"}${suffix}`;
  }
}
