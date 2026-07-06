import { seedDatabase } from "@/lib/db/seed-data";

seedDatabase()
  .then(() => {
    console.log("Database seeded.");
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
