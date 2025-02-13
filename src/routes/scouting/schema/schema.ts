import { z } from "zod";

export const eventFormSchema = z.object({
  event: z.string().max(50),
});

export type EventFormSchema = typeof eventFormSchema;

export const teamMetadataSchema = z.object({
  match_id: z.number().int(),
  team_id: z.number().int(),
  auton_park: z.boolean().default(false),
  auton_high_basket_sample: z.number().int().default(0),
  auton_high_chamber_specimen: z.number().int().default(0),
  total_push_samples: z.number().int().default(0),
  total_low_basket_samples: z.number().int().default(0),
  total_high_basket_samples: z.number().int().default(0),
  total_low_chamber_specimen: z.number().int().default(0),
  total_high_chamber_specimen: z.number().int().default(0),
  endgame_location: z.enum(['park', 'level_2_ascent', 'level_3_ascent', 'none']).default('none'),
  consistent_at: z.enum(['Sample', 'Specimen', 'Both']).optional(),
  game_strategy: z.enum(['Pushbot', 'Sample', 'Specimen', 'Both']).optional(),
  specimen_strategy: z.enum(['Stockpile', 'Cycling', 'N/A', 'Both']).optional(),
  synergy: z.enum(['Good Synergy and Good Team', 'Good Team', 'Mid Team', 'Bad']).optional(),
  other_notes: z.string().optional(),
});

export const autonSchema = z.object({
  auton_parking: z.boolean().default(false),
  auton_push_samples: z.number().int().default(0),
  auton_low_basket_samples: z.number().int().default(0),
  auton_high_basket_samples: z.number().int().default(0),
  auton_low_chamber_specimen: z.number().int().default(0),
  auton_high_chamber_specimen: z.number().int().default(0),
});

export const teleopSchema = z.object({
  total_push_samples: z.number().int().default(0),
  total_low_basket_samples: z.number().int().default(0),
  total_high_basket_samples: z.number().int().default(0),
  total_low_chamber_specimen: z.number().int().default(0),
  total_high_chamber_specimen: z.number().int().default(0),
});

export const endgameSchema = z.object({
  endgame_location: z.enum(['park', 'level_2_ascent', 'level_3_ascent', 'none']).default('none'),
  dc: z.boolean().default(false),
  overall_performance: z.enum(['Amazing', 'Mid', 'Cooked']).optional(),
  other_notes: z.string().optional(),
});

export type TeamMetadataSchema = typeof teamMetadataSchema;
export type AutonSchema = typeof autonSchema;
export type TeleopSchema = typeof teleopSchema;
export type EndgameSchema = typeof endgameSchema;
