import { seedDatabase } from "@/lib/db/seed-data";

export async function resetDatabase() {
  await seedDatabase();
}
