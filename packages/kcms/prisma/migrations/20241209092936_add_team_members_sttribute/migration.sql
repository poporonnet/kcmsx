/*
  Warnings:

  - Added the required column `members` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "members" TEXT NOT NULL,
    "robot_type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "club_name" TEXT,
    "is_entered" BOOLEAN NOT NULL
);
INSERT INTO "new_team" ("club_name", "department", "id", "is_entered", "name", "robot_type") SELECT "club_name", "department", "id", "is_entered", "name", "robot_type" FROM "team";
DROP TABLE "team";
ALTER TABLE "new_team" RENAME TO "team";
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
