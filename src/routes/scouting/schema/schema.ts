import { z } from "zod";

export const eventFormSchema = z.object({
  event: z.string().max(50),
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
  consistent_at: z.enum(["Artifacts", "Patterns", "Both"]).optional(),
  game_strategy: z.enum(["Pushbot", "Artifacts", "Patterns", "Both"]).optional(),
  artifact_strategy: z.enum(["Stockpile", "Cycling", "N/A", "Both"]).optional(),
  intake_type: z.enum(["Claw", "Active", "Other"]),
  synergy: z
    .enum(["Good Synergy and Good Team", "Good Team", "Mid Team", "Bad"])
    .optional(),
  pre_other_notes: z.string().optional(),
  auton_leave: z.boolean().default(false),
  auton_classified_artifacts: z.number().int().default(0),
  auton_overflow_artifacts: z.number().int().default(0),
  auton_patterns: z.number().int().default(0),
  motif: z.enum(["GPP", "PGP", "PPG"]).optional(),
  teleop_classified_artifacts: z.number().int().default(0),
  teleop_overflow_artifacts: z.number().int().default(0),
  teleop_depot_artifacts: z.number().int().default(0),
  teleop_patterns: z.number().int().default(0),
  endgame_location: z
    .enum(["Partial Base", "Full Base", "Both Base", "None"])
    .default("None"),
  dc: z.boolean().default(false),
  overall_performance: z.enum(["Amazing", "Mid", "Cooked"]).optional(),
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
  consistent_at: z.enum(["Artifacts", "Patterns", "Both"]).optional(),
  game_strategy: z.enum(["Pushbot", "Artifacts", "Patterns", "Both"]).optional(),
  artifact_strategy: z.enum(["Stockpile", "Cycling", "N/A", "Both"]).optional(),
  intake_type: z.enum(["Claw", "Active", "Other"]),
  synergy: z
    .enum(["Good Synergy and Good Team", "Good Team", "Mid Team", "Bad"])
    .optional(),
  pre_other_notes: z.string().optional(),
});

export type PreScoutingSchema = typeof preScoutingSchema;
