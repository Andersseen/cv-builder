import { Injectable } from "@angular/core";
import { Cv } from "../../domain/models/cv.model";
import { CvDatabase } from "./cv.database";

/**
 * Repository pattern over IndexedDB.
 * Handles all CRUD operations for CVs.
 */
@Injectable({ providedIn: "root" })
export class CvRepository {
  private db = new CvDatabase();

  /** Get all CVs, sorted by most recently updated first. */
  async getAll(): Promise<Cv[]> {
    return this.db.cvs.orderBy("updatedAt").reverse().toArray();
  }

  /** Get a single CV by ID. */
  async getById(id: string): Promise<Cv | undefined> {
    return this.db.cvs.get(id);
  }

  /** Insert or update a CV (upsert). */
  async save(cv: Cv): Promise<void> {
    await this.db.cvs.put(cv);
  }

  /** Delete a CV by ID. */
  async delete(id: string): Promise<void> {
    await this.db.cvs.delete(id);
  }

  /** Check if any CVs exist. */
  async count(): Promise<number> {
    return this.db.cvs.count();
  }
}
