import Dexie, { Table } from "dexie";
import { Cv } from "../../domain/models/cv.model";

/**
 * IndexedDB database using Dexie.js.
 *
 * Version history:
 *   v1  — Initial schema with `cvs` table
 */
export class CvDatabase extends Dexie {
  cvs!: Table<Cv, string>;

  constructor() {
    super("cv-builder-db");

    this.version(1).stores({
      // Primary key = id, indexed by updatedAt for sorting
      cvs: "id, updatedAt",
    });
  }
}
