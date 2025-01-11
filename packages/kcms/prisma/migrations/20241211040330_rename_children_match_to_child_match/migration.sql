/*
  Warnings:

  - You are about to drop the column `children_left_id` on the `main_match` table. All the data in the column will be lost.
  - You are about to drop the column `children_right_id` on the `main_match` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_main_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "department_type" TEXT NOT NULL,
    "course_index" INTEGER NOT NULL,
    "match_index" INTEGER NOT NULL,
    "left_team_id" TEXT,
    "right_team_id" TEXT,
    "child_left_id" TEXT,
    "child_right_id" TEXT,
    "winner_team_id" TEXT,
    CONSTRAINT "main_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_child_left_id_fkey" FOREIGN KEY ("child_left_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_child_right_id_fkey" FOREIGN KEY ("child_right_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_main_match" ("course_index", "department_type", "id", "left_team_id", "match_index", "right_team_id", "winner_team_id") SELECT "course_index", "department_type", "id", "left_team_id", "match_index", "right_team_id", "winner_team_id" FROM "main_match";
DROP TABLE "main_match";
ALTER TABLE "new_main_match" RENAME TO "main_match";
CREATE UNIQUE INDEX "main_match_child_left_id_key" ON "main_match"("child_left_id");
CREATE UNIQUE INDEX "main_match_child_right_id_key" ON "main_match"("child_right_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
