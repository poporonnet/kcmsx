/*
  Warnings:

  - You are about to drop the column `match_type` on the `pre_match` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pre_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "department_type" TEXT NOT NULL,
    "course_index" INTEGER NOT NULL,
    "match_index" INTEGER NOT NULL,
    "left_team_id" TEXT,
    "right_team_id" TEXT,
    CONSTRAINT "pre_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pre_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_pre_match" ("course_index", "department_type", "id", "left_team_id", "match_index", "right_team_id") SELECT "course_index", "department_type", "id", "left_team_id", "match_index", "right_team_id" FROM "pre_match";
DROP TABLE "pre_match";
ALTER TABLE "new_pre_match" RENAME TO "pre_match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
