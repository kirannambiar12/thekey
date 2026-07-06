import { mkdirSync } from "node:fs";
import path from "node:path";

const testDbPath = path.join(process.cwd(), "data/test.db");

process.env.DATABASE_PATH = testDbPath;
mkdirSync(path.dirname(testDbPath), { recursive: true });
