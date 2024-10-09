/*
  Warnings:

  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `department_type` to the `pre_match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `match_type` to the `pre_match` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Team_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Team";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "robot_type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "club_name" TEXT,
    "is_entered" BOOLEAN NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_main_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_index" INTEGER NOT NULL,
    "match_index" INTEGER NOT NULL,
    "left_team_id" TEXT,
    "right_team_id" TEXT,
    "winner_team_id" TEXT,
    CONSTRAINT "main_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_main_match" ("course_index", "id", "left_team_id", "match_index", "right_team_id", "winner_team_id") SELECT "course_index", "id", "left_team_id", "match_index", "right_team_id", "winner_team_id" FROM "main_match";
DROP TABLE "main_match";
ALTER TABLE "new_main_match" RENAME TO "main_match";
CREATE TABLE "new_pre_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "department_type" TEXT NOT NULL,
    "match_type" TEXT NOT NULL,
    "course_index" INTEGER NOT NULL,
    "match_index" INTEGER NOT NULL,
    "left_team_id" TEXT,
    "right_team_id" TEXT,
    CONSTRAINT "pre_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pre_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_pre_match" ("course_index", "id", "left_team_id", "match_index", "right_team_id") SELECT "course_index", "id", "left_team_id", "match_index", "right_team_id" FROM "pre_match";
DROP TABLE "pre_match";
ALTER TABLE "new_pre_match" RENAME TO "pre_match";
CREATE TABLE "new_run_result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "points" INTEGER NOT NULL,
    "goal_time_seconds" INTEGER NOT NULL,
    "finish_state" INTEGER NOT NULL,
    "team_id" TEXT NOT NULL,
    "main_match_id" TEXT,
    "pre_match_id" TEXT,
    CONSTRAINT "run_result_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "run_result_main_match_id_fkey" FOREIGN KEY ("main_match_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "run_result_pre_match_id_fkey" FOREIGN KEY ("pre_match_id") REFERENCES "pre_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_run_result" ("finish_state", "goal_time_seconds", "id", "main_match_id", "points", "pre_match_id", "team_id") SELECT "finish_state", "goal_time_seconds", "id", "main_match_id", "points", "pre_match_id", "team_id" FROM "run_result";
DROP TABLE "run_result";
ALTER TABLE "new_run_result" RENAME TO "run_result";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");
