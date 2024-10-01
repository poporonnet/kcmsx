-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "robot_type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "club_name" TEXT,
    "is_entered" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "main_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_index" INTEGER NOT NULL,
    "match_index" INTEGER NOT NULL,
    "left_team_id" TEXT,
    "right_team_id" TEXT,
    "winner_team_id" TEXT,
    CONSTRAINT "main_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "main_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pre_match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_index" INTEGER NOT NULL,
    "match_index" INTEGER NOT NULL,
    "left_team_id" TEXT,
    "right_team_id" TEXT,
    CONSTRAINT "pre_match_left_team_id_fkey" FOREIGN KEY ("left_team_id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pre_match_right_team_id_fkey" FOREIGN KEY ("right_team_id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "run_result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "points" INTEGER NOT NULL,
    "goal_time_seconds" INTEGER NOT NULL,
    "finish_state" INTEGER NOT NULL,
    "team_id" TEXT NOT NULL,
    "main_match_id" TEXT,
    "pre_match_id" TEXT,
    CONSTRAINT "run_result_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "run_result_main_match_id_fkey" FOREIGN KEY ("main_match_id") REFERENCES "main_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "run_result_pre_match_id_fkey" FOREIGN KEY ("pre_match_id") REFERENCES "pre_match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
