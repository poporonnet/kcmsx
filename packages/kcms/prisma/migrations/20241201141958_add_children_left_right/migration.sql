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
    "parent_match_id" TEXT,
    "children_left_match_id" TEXT,
    "children_right_match_id" TEXT,
    "winner_team_id" TEXT,
    CONSTRAINT "main_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_parent_match_id_fkey" FOREIGN KEY ("parent_match_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_children_left_match_id_fkey" FOREIGN KEY ("children_left_match_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_children_left_match_id_fkey" FOREIGN KEY ("children_left_match_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_main_match" ("course_index", "department_type", "id", "left_team_id", "match_index", "parent_match_id", "right_team_id", "winner_team_id") SELECT "course_index", "department_type", "id", "left_team_id", "match_index", "parent_match_id", "right_team_id", "winner_team_id" FROM "main_match";
DROP TABLE "main_match";
ALTER TABLE "new_main_match" RENAME TO "main_match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
