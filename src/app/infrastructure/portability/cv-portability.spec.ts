import { describe, it, expect } from "vitest";
import {
  CvPortability,
  createCvExportEnvelope,
  createBackupEnvelope,
  CV_JSON_SCHEMA_VERSION,
} from "./cv-portability";
import { createDefaultCv } from "../../domain/models/cv-defaults";

function jsonFile(content: unknown, filename = "test.cv.json"): File {
  return new File([JSON.stringify(content)], filename, {
    type: "application/json",
  });
}

describe("CvPortability", () => {
  const service = new CvPortability();

  describe("export envelopes", () => {
    it("includes schemaVersion in single-CV envelope", () => {
      const cv = createDefaultCv({ name: "Export Me" });
      const envelope = createCvExportEnvelope(cv);
      expect(envelope.schemaVersion).toBe(CV_JSON_SCHEMA_VERSION);
      expect(envelope.cv).toEqual(cv);
    });

    it("includes schemaVersion in backup envelope", () => {
      const cv = createDefaultCv({ name: "Backup" });
      const envelope = createBackupEnvelope([cv]);
      expect(envelope.schemaVersion).toBe(CV_JSON_SCHEMA_VERSION);
      expect(envelope.cvs).toEqual([cv]);
    });
  });

  describe("importCv", () => {
    it("round-trips a valid single-CV export", async () => {
      const cv = createDefaultCv({ name: "Round Trip" });
      const envelope = createCvExportEnvelope(cv);
      const file = jsonFile(envelope, "round-trip.cv.json");

      const result = await service.importCv(file, new Set());

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.cv).toEqual(cv);
    });

    it("regenerates id on collision", async () => {
      const cv = createDefaultCv({ name: "Collision" });
      const envelope = createCvExportEnvelope(cv);
      const file = jsonFile(envelope);

      const result = await service.importCv(file, new Set([cv.id]));

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.cv.id).not.toBe(cv.id);
      expect(result.cv.name).toBe(cv.name);
    });

    it("rejects malformed JSON", async () => {
      const file = new File(["not json"], "bad.cv.json", {
        type: "application/json",
      });
      const result = await service.importCv(file, new Set());
      expect(result.success).toBe(false);
    });

    it("rejects valid JSON with invalid CV shape", async () => {
      const file = jsonFile({ schemaVersion: 1, cv: { id: "x" } });
      const result = await service.importCv(file, new Set());
      expect(result.success).toBe(false);
    });
  });

  describe("importAll", () => {
    it("round-trips a full backup", async () => {
      const cv1 = createDefaultCv({ name: "One" });
      const cv2 = createDefaultCv({ name: "Two" });
      const envelope = createBackupEnvelope([cv1, cv2]);
      const file = jsonFile(envelope, "backup.cv.json");

      const result = await service.importAll(file, new Set());

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.cvs).toEqual([cv1, cv2]);
    });

    it("deduplicates ids within the backup and against existing ids", async () => {
      const cv1 = createDefaultCv({ name: "One" });
      const cv2 = { ...createDefaultCv({ name: "Two" }), id: cv1.id };
      const envelope = createBackupEnvelope([cv1, cv2]);
      const file = jsonFile(envelope, "backup.cv.json");

      const result = await service.importAll(file, new Set());

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.cvs[0].id).toBe(cv1.id);
      expect(result.cvs[1].id).not.toBe(cv1.id);
    });

    it("rejects backups with invalid entries", async () => {
      const file = jsonFile({ schemaVersion: 1, cvs: [{ id: "x" }] });
      const result = await service.importAll(file, new Set());
      expect(result.success).toBe(false);
    });

    it("rejects non-array backup shapes", async () => {
      const file = jsonFile({ schemaVersion: 1, cvs: "not-an-array" });
      const result = await service.importAll(file, new Set());
      expect(result.success).toBe(false);
    });
  });
});
