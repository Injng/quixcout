import { z } from "zod";

export const eventFormSchema = z.object({
  event: z.string().max(50),
  movement_threshold: z.number().int().default(16),
  goal_threshold: z.number().int().default(36),
  pattern_threshold: z.number().int().default(18),
});

export type EventFormSchema = typeof eventFormSchema;

export const scoutingSchema = z.object({
  event_id: z.string(),
  match_num: z.number().int(),
  alliance: z.enum(["red", "blue"]),
  team_id: z.string(),
  pre_auton_leave: z.boolean().default(false),
  pre_auton_classified_artifacts: z.number().int().default(0),
  pre_auton_overflow_artifacts: z.number().int().default(0),
  pre_auton_patterns: z.number().int().default(0),
  pre_teleop_classified_artifacts: z.number().int().default(0),
  pre_teleop_depot_artifacts: z.number().int().default(0),
  pre_teleop_overflow_artifacts: z.number().int().default(0),
  pre_teleop_patterns: z.number().int().default(0),
  pre_endgame_location: z
    .enum(["Partial Base", "Full Base", "Both Base", "None"])
    .default("None"),
  consistent_at: z.enum(["Artifacts", "Patterns", "Both"]).nullish(),
  game_strategy: z.enum(["Pushbot", "Artifacts", "Patterns", "Both"]).nullish(),
  artifact_strategy: z.enum(["Stockpile", "Cycling", "N/A", "Both"]).nullish(),
  intake_type: z.enum(["Claw", "Active", "Other"]).nullish(),
  synergy: z
    .enum(["Good Synergy and Good Team", "Good Team", "Mid Team", "Bad"]).nullish(),
  pre_other_notes: z.string().optional(),
  auton_leave: z.boolean().default(false),
  auton_classified_artifacts: z.number().int().default(0),
  auton_overflow_artifacts: z.number().int().default(0),
  auton_patterns: z.number().int().default(0),
  motif: z.enum(["GPP", "PGP", "PPG"]).nullish(),
  teleop_classified_artifacts: z.number().int().default(0),
  teleop_overflow_artifacts: z.number().int().default(0),
  teleop_depot_artifacts: z.number().int().default(0),
  teleop_patterns: z.number().int().default(0),
  endgame_location: z
    .enum(["Partial Base", "Full Base", "None"])
    .default("None"),
  win: z.boolean().default(false),
  tie: z.boolean().default(false),
  dc: z.boolean().default(false),
  overall_performance: z.enum(["Amazing", "Mid", "Cooked"]).nullish(),
  other_notes: z.string().optional(),
});

export type ScoutingSchema = typeof scoutingSchema;

export const preScoutingSchema = z.object({
  event_id: z.string(),
  team_id: z.string(),
  pre_auton_leave: z.boolean().default(false),
  pre_auton_classified_artifacts: z.number().int().default(0),
  pre_auton_overflow_artifacts: z.number().int().default(0),
  pre_auton_patterns: z.number().int().default(0),
  pre_teleop_classified_artifacts: z.number().int().default(0),
  pre_teleop_depot_artifacts: z.number().int().default(0),
  pre_teleop_overflow_artifacts: z.number().int().default(0),
  pre_teleop_patterns: z.number().int().default(0),
  pre_endgame_location: z
    .enum(["Partial Base", "Full Base", "Both Base", "None"])
    .default("None"),
  consistent_at: z.enum(["Artifacts", "Patterns", "Both"]).nullish(),
  game_strategy: z.enum(["Pushbot", "Artifacts", "Patterns", "Both"]).nullish(),
  artifact_strategy: z.enum(["Stockpile", "Cycling", "N/A", "Both"]).nullish(),
  intake_type: z.enum(["Claw", "Active", "Other"]).nullish(),
  synergy: z
    .enum(["Good Synergy and Good Team", "Good Team", "Mid Team", "Bad"]).nullish(),
  pre_other_notes: z.string().optional(),
});

export type PreScoutingSchema = typeof preScoutingSchema;
