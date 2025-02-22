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
  pre_auton_park: z.boolean().default(false),
  pre_auton_high_basket_samples: z.number().int().default(0),
  pre_auton_high_chamber_specimen: z.number().int().default(0),
  pre_total_push_samples: z.number().int().default(0),
  pre_total_low_basket_samples: z.number().int().default(0),
  pre_total_high_basket_samples: z.number().int().default(0),
  pre_total_low_chamber_specimen: z.number().int().default(0),
  pre_total_high_chamber_specimen: z.number().int().default(0),
  pre_endgame_location: z
    .enum(["park", "level_2_ascent", "level_3_ascent", "none"])
    .default("none"),
  consistent_at: z.enum(["Sample", "Specimen", "Both"]).optional(),
  game_strategy: z.enum(["Pushbot", "Sample", "Specimen", "Both"]).optional(),
  specimen_strategy: z.enum(["Stockpile", "Cycling", "N/A", "Both"]).optional(),
  intake_type: z.enum(["Claw", "Active", "Other"]),
  far_extension: z.boolean().default(false),
  has_sweeper: z.boolean().default(false),
  active_room: z.boolean().default(false),
  synergy: z
    .enum(["Good Synergy and Good Team", "Good Team", "Mid Team", "Bad"])
    .optional(),
  pre_other_notes: z.string().optional(),
  auton_parking: z.boolean().default(false),
  auton_push_samples: z.number().int().default(0),
  auton_low_basket_samples: z.number().int().default(0),
  auton_high_basket_samples: z.number().int().default(0),
  auton_low_chamber_specimen: z.number().int().default(0),
  auton_high_chamber_specimen: z.number().int().default(0),
  total_push_samples: z.number().int().default(0),
  total_low_basket_samples: z.number().int().default(0),
  total_high_basket_samples: z.number().int().default(0),
  total_low_chamber_specimen: z.number().int().default(0),
  total_high_chamber_specimen: z.number().int().default(0),
  endgame_location: z
    .enum(["park", "level_2_ascent", "level_3_ascent", "none"])
    .default("none"),
  dc: z.boolean().default(false),
  overall_performance: z.enum(["Amazing", "Mid", "Cooked"]).optional(),
  other_notes: z.string().optional(),
});

export type ScoutingSchema = typeof scoutingSchema;

export const preScoutingSchema = z.object({
  event_id: z.string(),
  team_id: z.string(),
  pre_auton_park: z.boolean().default(false),
  pre_auton_high_basket_samples: z.number().int().default(0),
  pre_auton_high_chamber_specimen: z.number().int().default(0),
  pre_total_push_samples: z.number().int().default(0),
  pre_total_low_basket_samples: z.number().int().default(0),
  pre_total_high_basket_samples: z.number().int().default(0),
  pre_total_low_chamber_specimen: z.number().int().default(0),
  pre_total_high_chamber_specimen: z.number().int().default(0),
  pre_endgame_location: z
    .enum(["park", "level_2_ascent", "level_3_ascent", "none"])
    .default("none"),
  consistent_at: z.enum(["Sample", "Specimen", "Both"]).optional(),
  game_strategy: z.enum(["Pushbot", "Sample", "Specimen", "Both"]).optional(),
  specimen_strategy: z.enum(["Stockpile", "Cycling", "N/A", "Both"]).optional(),
  intake_type: z.enum(["Claw", "Active", "Other"]),
  far_extension: z.boolean().default(false),
  has_sweeper: z.boolean().default(false),
  active_room: z.boolean().default(false),
  synergy: z
    .enum(["Good Synergy and Good Team", "Good Team", "Mid Team", "Bad"])
    .optional(),
  pre_other_notes: z.string().optional(),
});

export type PreScoutingSchema = typeof preScoutingSchema;
