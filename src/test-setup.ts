import "@analogjs/vitest-angular/setup-snapshots";
import { setupTestBed } from "@analogjs/vitest-angular/setup-testbed";

// The app bootstraps zoneless, so tests do too — no zone.js anywhere.
setupTestBed({ zoneless: true });
